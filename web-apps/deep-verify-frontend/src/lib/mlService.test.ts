import { describe, expect, it } from "vitest";

import { toResult } from "./mlService";

const details = {
  fake_probability: 0.0960254818201065,
  real_probability: 0.9039745181798935,
  threshold: 0.5,
  is_deepfake: false,
  face_box: [10, 0, 223, 191] as [number, number, number, number],
  face_confidence: 0.9489738345146179,
  model_id: "yermandy/deepfake-detection/model.torchscript",
};

const verdict =
  "### No manipulation detected\n\n**9.6%** likelihood of manipulation, at a " +
  "decision threshold of 50%.\n\nFace located at (10, 0, 223, 191), detector " +
  "confidence 94.9%.";

const label = {
  label: "Authentic",
  confidences: [
    { label: "Authentic", confidence: 0.9039745 },
    { label: "Manipulated", confidence: 0.0960255 },
  ],
};

describe("toResult", () => {
  it("reads the structured third output", () => {
    expect(toResult([label, verdict, details])).toEqual({
      isDeepfake: false,
      fakeProbability: 0.0960254818201065,
      realProbability: 0.9039745181798935,
      threshold: 0.5,
      faceBox: [10, 0, 223, 191],
      faceConfidence: 0.9489738345146179,
      modelId: "yermandy/deepfake-detection/model.torchscript",
    });
  });

  // Regression: these were recovered by regex from the rendered verdict, and the
  // confidence pattern captured the sentence's trailing full stop, so Number()
  // produced NaN and the UI rendered "NaN%".
  it("keeps numeric fields finite", () => {
    const result = toResult([label, verdict, details]);
    expect(Number.isFinite(result.faceConfidence!)).toBe(true);
    expect(Number.isFinite(result.fakeProbability)).toBe(true);
  });

  // A client deployed ahead of the service still has to render something.
  it("falls back to the label output when details are absent", () => {
    const result = toResult([label, verdict]);
    expect(result.fakeProbability).toBeCloseTo(0.0960255);
    expect(result.isDeepfake).toBe(false);
    expect(result.faceConfidence).toBeNull();
  });
});
