import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DetectionResult } from './schemas/detection.schema';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class DetectionService {
  constructor(
    @InjectModel(DetectionResult.name) private detectionResultModel: Model<DetectionResult>,
  ) {}

  async detectDeepfake(file: Express.Multer.File, inputType: string): Promise<DetectionResult> {
    const [isDeepfake, confidence] = await this.processFile(file.buffer, inputType, file.originalname);

    const detectionResult = new this.detectionResultModel({
      fileName: file.originalname,
      mediaType: file.mimetype,
      isDeepfake: isDeepfake,
      confidence: `${confidence}%`,
      detectedAt: new Date(),
    });

    await detectionResult.save();

    return detectionResult;
  }

  private async processFile(buffer: Buffer, inputType: string, fileName: string): Promise<[boolean, number]> {
    try {
      const response: AxiosResponse = await axios.post('http://fastapi-service/detect', {
        file: buffer.toString('base64'), // Assuming the FastAPI service expects base64 encoded file data
        inputType,
      });

      if (response.status !== 200) {
        throw new Error("Error processing media");
      }

      const data = response.data;
      const visualScore = data.score;

      if (visualScore === null) {
        throw new Error("No score calculated");
      }

      const isDeepfake = visualScore > 0.5;
      const confidence = Math.round(visualScore * 100 * 10) / 10; // Round to 1 decimal place

      return [isDeepfake, confidence];
    } catch (e) {
      console.error(`An error occurred: ${e.message}`);
      throw new Error('Deepfake detection failed');
    }
  }

  async getDetectionHistory() {
    return this.detectionResultModel.find().sort({ detectedAt: -1 }).exec();
  }

  async getDetectionDetails(id: string) {
    console.log(id)
    return this.detectionResultModel.findById(id).exec();
  }
}