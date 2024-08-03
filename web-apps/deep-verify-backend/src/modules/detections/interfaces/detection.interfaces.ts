

export interface DetectionResultProps {
  _id?: string;
  fileName: string;
  mediaType: string;
  isDeepfake: boolean;
  confidence: number;
  detectedAt: Date;
  toObject?: () => any;
}

