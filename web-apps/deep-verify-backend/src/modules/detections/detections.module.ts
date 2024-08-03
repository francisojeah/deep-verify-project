import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DetectionResult, DetectionResultSchema } from './schemas/detection.schema';
import { DetectionController } from './detections.controller';
import { DetectionService } from './detections.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DetectionResult.name, schema: DetectionResultSchema },
      
    ]),
  ],
  controllers: [DetectionController],
  providers: [DetectionService],
  exports: [MongooseModule],
})
export class DetectionModule {}
