import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';
import { DetectionResultProps } from '../interfaces/detection.interfaces';

export type DetectionResultDocument = HydratedDocument<DetectionResultProps>;


@Schema({ timestamps: true })
export class DetectionResult {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mediaType: string;

  @Prop({ required: true })
  isDeepfake: boolean;

  @Prop({ required: true })
  confidence: number;

  @Prop({ required: true })
  detectedAt: Date;
}

export const DetectionResultSchema = SchemaFactory.createForClass(DetectionResult);
DetectionResultSchema.plugin(customTimestampPlugin);
