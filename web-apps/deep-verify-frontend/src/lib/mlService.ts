/**
 * Client for the deployed detection service.
 *
 * The service runs as a Gradio Space on Hugging Face ZeroGPU, which exposes a
 * three-call HTTP protocol: upload the file, start the job, then read the result
 * from an SSE stream. Raw fetch is used rather than @gradio/client because that
 * package is ESM-only and the NestJS layer shares this contract.
 */

export const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL ?? "";

export interface DetectionResult {
  isDeepfake: boolean;
  fakeProbability: number;
  realProbability: number;
  threshold: number;
  faceBox: [number, number, number, number] | null;
  faceConfidence: number | null;
  modelId: string;
}

export class NoFaceDetectedError extends Error {}

interface GradioLabel {
  label: string;
  confidences?: { label: string; confidence: number }[];
}

async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("files", file);

  const response = await fetch(`${ML_SERVICE_URL}/gradio_api/upload`, {
    method: "POST",
    body,
  });
  if (!response.ok) throw new Error(`Upload failed (${response.status})`);

  const paths: string[] = await response.json();
  if (!paths?.length) throw new Error("Upload returned no file path");
  return paths[0];
}

async function startJob(path: string): Promise<string> {
  const response = await fetch(`${ML_SERVICE_URL}/gradio_api/call/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{ path, meta: { _type: "gradio.FileData" } }],
    }),
  });
  if (!response.ok)
    throw new Error(`Could not start detection (${response.status})`);

  const { event_id } = await response.json();
  if (!event_id) throw new Error("Detection did not return an event id");
  return event_id;
}

async function readResult(eventId: string): Promise<unknown[]> {
  const response = await fetch(
    `${ML_SERVICE_URL}/gradio_api/call/detect/${eventId}`,
  );
  if (!response.ok || !response.body) {
    throw new Error(`Could not read detection result (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let event = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        const payload = line.slice(5).trim();
        if (event === "error") {
          if (payload.toLowerCase().includes("no face")) {
            throw new NoFaceDetectedError(payload);
          }
          throw new Error(payload || "Detection failed");
        }
        if (event === "complete") return JSON.parse(payload);
      }
    }
  }

  throw new Error("Detection stream ended without a result");
}

interface GradioDetails {
  fake_probability: number;
  real_probability: number;
  threshold: number;
  is_deepfake: boolean;
  face_box: [number, number, number, number];
  face_confidence: number;
  model_id: string;
}

/** Map the Gradio outputs into the shape the UI needs.
 *
 * The service returns structured details as a third output. The Label output is
 * read as a fallback so a client deployed ahead of the service still works.
 */
export function toResult(output: unknown[]): DetectionResult {
  const details = output[2] as GradioDetails | undefined;
  if (details?.fake_probability !== undefined) {
    return {
      isDeepfake: details.is_deepfake,
      fakeProbability: details.fake_probability,
      realProbability: details.real_probability,
      threshold: details.threshold,
      faceBox: details.face_box ?? null,
      faceConfidence: details.face_confidence ?? null,
      modelId: details.model_id,
    };
  }

  const label = output[0] as GradioLabel;
  const scores = Object.fromEntries(
    (label?.confidences ?? []).map((c) => [c.label, c.confidence]),
  );
  const fake = scores["Manipulated"] ?? 0;

  return {
    isDeepfake: fake >= 0.5,
    fakeProbability: fake,
    realProbability: scores["Authentic"] ?? 1 - fake,
    threshold: 0.5,
    faceBox: null,
    faceConfidence: null,
    modelId: "yermandy/deepfake-detection",
  };
}

export async function detectImage(file: File): Promise<DetectionResult> {
  if (!ML_SERVICE_URL) {
    throw new Error("VITE_ML_SERVICE_URL is not configured");
  }
  const path = await uploadFile(file);
  const eventId = await startJob(path);
  return toResult(await readResult(eventId));
}
