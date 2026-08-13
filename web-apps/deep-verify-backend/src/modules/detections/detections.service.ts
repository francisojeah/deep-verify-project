import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DetectionResult } from './schemas/detection.schema';
import { DetectionClient } from './detection-client.service';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png'];

@Injectable()
export class DetectionService {
  constructor(
    @InjectModel(DetectionResult.name)
    private detectionResultModel: Model<DetectionResult>,
    private readonly client: DetectionClient,
  ) {}

  async detectDeepfake(
    file: Express.Multer.File,
    userId: string,
  ): Promise<DetectionResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (file.size > MAX_BYTES) {
      throw new PayloadTooLargeException('Images must be 10MB or smaller');
    }
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Only JPG and PNG images are supported');
    }

    const detection = await this.client.detect(file);

    return this.detectionResultModel.create({
      user: new Types.ObjectId(userId),
      fileName: file.originalname,
      mediaType: file.mimetype,
      isDeepfake: detection.isDeepfake,
      fakeProbability: detection.fakeProbability,
      threshold: detection.threshold,
      modelId: detection.modelId,
      detectedAt: new Date(),
    });
  }

  /** Scoped to the caller. Previously an unfiltered find(), which leaked every
   *  user's uploads to anyone who asked. */
  async getDetectionHistory(userId: string) {
    return this.detectionResultModel
      .find({ user: new Types.ObjectId(userId) })
      .sort({ detectedAt: -1 })
      .limit(100)
      .exec();
  }

  async getDetectionDetails(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid detection id');
    }
    return this.detectionResultModel
      .findOne({ _id: new Types.ObjectId(id), user: new Types.ObjectId(userId) })
      .exec();
  }
}
