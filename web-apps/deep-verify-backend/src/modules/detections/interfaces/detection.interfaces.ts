export interface DetectionResultProps {
  _id?: string;
  user: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  /** p(manipulated) in [0, 1]. */
  fakeProbability: number;
  threshold: number;
  modelId: string;
  detectedAt: Date;
  toObject?: () => any;
}
