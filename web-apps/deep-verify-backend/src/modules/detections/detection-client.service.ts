import { Injectable, Logger, ServiceUnavailableException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Detection {
  isDeepfake: boolean;
  fakeProbability: number;
  threshold: number;
  modelId: string;
}

/**
 * Talks to the Python detection service.
 *
 * Two transports because the service runs in two shapes: as a Gradio Space on
 * Hugging Face ZeroGPU (the deployed demo) and as the FastAPI app in
 * deepverify/api.py (Docker, self-hosted). Both wrap the same detector module.
 */
@Injectable()
export class DetectionClient {
  private readonly logger = new Logger(DetectionClient.name);
  private readonly baseUrl: string;
  private readonly mode: 'gradio' | 'http';
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    this.baseUrl = (config.get<string>('ML_SERVICE_URL') ?? '').replace(/\/$/, '');
    this.mode = config.get<string>('ML_SERVICE_MODE') === 'http' ? 'http' : 'gradio';
    this.timeoutMs = Number(config.get<string>('ML_SERVICE_TIMEOUT_MS') ?? 90_000);
  }

  async detect(file: Express.Multer.File): Promise<Detection> {
    if (!this.baseUrl) {
      throw new ServiceUnavailableException('ML_SERVICE_URL is not configured');
    }
    return this.mode === 'http' ? this.viaHttp(file) : this.viaGradio(file);
  }

  private async fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (error) {
      this.logger.error(`ML service request failed: ${url}`, error as Error);
      throw new ServiceUnavailableException(
        'The detection service is unavailable. Free hosting sleeps when idle.',
      );
    } finally {
      clearTimeout(timer);
    }
  }

  private toBlob(file: Express.Multer.File): Blob {
    return new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' });
  }

  /** FastAPI: POST /v1/detect, multipart. */
  private async viaHttp(file: Express.Multer.File): Promise<Detection> {
    const body = new FormData();
    body.append('file', this.toBlob(file), file.originalname);

    const response = await this.fetchWithTimeout(`${this.baseUrl}/v1/detect`, {
      method: 'POST',
      body,
    });

    if (response.status === 422) {
      throw new UnprocessableEntityException(
        'No face detected. This model scores face crops, so it returns nothing rather than guess.',
      );
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(`Detection failed (${response.status})`);
    }

    const data = await response.json();
    return {
      isDeepfake: data.is_deepfake,
      fakeProbability: data.fake_probability,
      threshold: data.threshold,
      modelId: data.model_id,
    };
  }

  /** Gradio Space: upload, start the job, then read the SSE stream. */
  private async viaGradio(file: Express.Multer.File): Promise<Detection> {
    const uploadBody = new FormData();
    uploadBody.append('files', this.toBlob(file), file.originalname);

    const uploaded = await this.fetchWithTimeout(`${this.baseUrl}/gradio_api/upload`, {
      method: 'POST',
      body: uploadBody,
    });
    if (!uploaded.ok) {
      throw new ServiceUnavailableException(`Upload failed (${uploaded.status})`);
    }
    const [path] = (await uploaded.json()) as string[];

    const started = await this.fetchWithTimeout(`${this.baseUrl}/gradio_api/call/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [{ path, meta: { _type: 'gradio.FileData' } }] }),
    });
    if (!started.ok) {
      throw new ServiceUnavailableException(`Detection failed (${started.status})`);
    }
    const { event_id: eventId } = await started.json();

    const stream = await this.fetchWithTimeout(
      `${this.baseUrl}/gradio_api/call/detect/${eventId}`,
    );
    const payload = await this.readEventStream(await stream.text());

    const confidences: { label: string; confidence: number }[] =
      payload?.[0]?.confidences ?? [];
    const fakeProbability =
      confidences.find((c) => c.label === 'Manipulated')?.confidence ?? 0;

    return {
      isDeepfake: fakeProbability >= 0.5,
      fakeProbability,
      threshold: 0.5,
      modelId: 'yermandy/deepfake-detection',
    };
  }

  private async readEventStream(text: string): Promise<any[]> {
    let event = '';
    for (const line of text.split('\n')) {
      if (line.startsWith('event:')) {
        event = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        const data = line.slice(5).trim();
        if (event === 'error') {
          if (data.toLowerCase().includes('no face')) {
            throw new UnprocessableEntityException(
              'No face detected. This model scores face crops, so it returns nothing rather than guess.',
            );
          }
          throw new ServiceUnavailableException(data || 'Detection failed');
        }
        if (event === 'complete') return JSON.parse(data);
      }
    }
    throw new ServiceUnavailableException('Detection stream ended without a result');
  }
}
