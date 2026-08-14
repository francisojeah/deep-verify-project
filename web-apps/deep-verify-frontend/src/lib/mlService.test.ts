import { describe, expect, it } from "vitest";

import { toResult } from "./mlService";

const response = {
  is_deepfake: false,
  fake_probability: 0.0960254818201065,
  real_probability: 0.9039745181798935,
  threshold: 0.5,
  face_box: [10, 0, 223, 191] as [number, number, number, number],
  face_confidence: 0.9489738345146179,
  model_id: "yermandy/deepfake-detection/model.torchscript",
};

describe("toResult", () => {
  it("maps the service response onto the UI shape", () => {
    expect(toResult(response)).toEqual({
      isDeepfake: false,
      fakeProbability: 0.0960254818201065,
      realProbability: 0.9039745181798935,
      threshold: 0.5,
      faceBox: [10, 0, 223, 191],
      faceConfidence: 0.9489738345146179,
      modelId: "yermandy/deepfake-detection/model.torchscript",
    });
  });

  // Regression: these were recovered by regex from rendered markdown, and the
  // confidence pattern captured the sentence's trailing full stop, so Number()
  // produced NaN and the UI rendered "NaN%".
  it("keeps numeric fields finite", () => {
    const result = toResult(response);
    expect(Number.isFinite(result.faceConfidence!)).toBe(true);
    expect(Number.isFinite(result.fakeProbability)).toBe(true);
  });

  it("tolerates a response with no face box", () => {
    const result = toResult({ ...response, face_box: undefined as never });
    expect(result.faceBox).toBeNull();
  });
});
