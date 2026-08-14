/**
 * Client for the deployed detection service.
 *
 * The service exposes a plain REST endpoint alongside its Gradio UI, so this is
 * a single multipart POST. It previously drove Gradio's internal three-call
 * upload/SSE protocol and recovered fields by running regexes over rendered
 * markdown, which is how a trailing full stop once reached the UI as NaN.
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

interface DetectionResponse {
  is_deepfake: boolean;
  fake_probability: number;
  real_probability: number;
  threshold: number;
  face_box: [number, number, number, number];
  face_confidence: number;
  model_id: string;
}

export function toResult(payload: DetectionResponse): DetectionResult {
  return {
    isDeepfake: payload.is_deepfake,
    fakeProbability: payload.fake_probability,
    realProbability: payload.real_probability,
    threshold: payload.threshold,
    faceBox: payload.face_box ?? null,
    faceConfidence: payload.face_confidence ?? null,
    modelId: payload.model_id,
  };
}

export async function detectImage(file: File): Promise<DetectionResult> {
  if (!ML_SERVICE_URL) {
    throw new Error("VITE_ML_SERVICE_URL is not configured");
  }

  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${ML_SERVICE_URL}/v1/detect`, {
    method: "POST",
    body,
  });

  if (response.status === 422) {
    throw new NoFaceDetectedError("no face detected");
  }
  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.detail ?? `Detection failed (${response.status})`);
  }

  return toResult(await response.json());
}
