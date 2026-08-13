import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { customTimestampPlugin } from '@/utils/custom-timestamp.plugin';
import { DetectionResultProps } from '../interfaces/detection.interfaces';

export type DetectionResultDocument = HydratedDocument<DetectionResultProps>;

@Schema({ timestamps: true })
export class DetectionResult {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mediaType: string;

  @Prop({ required: true })
  isDeepfake: boolean;

  /** p(manipulated) in [0, 1]. Named for what it is: this is the model's output
   *  probability, not a confidence in the verdict. */
  @Prop({ required: true, min: 0, max: 1 })
  fakeProbability: number;

  @Prop({ required: true })
  threshold: number;

  /** Which pre-trained checkpoint produced this score. */
  @Prop({ required: true })
  modelId: string;

  @Prop({ required: true })
  detectedAt: Date;
}

export const DetectionResultSchema = SchemaFactory.createForClass(DetectionResult);
DetectionResultSchema.plugin(customTimestampPlugin);
