import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DetectionResult, DetectionResultSchema } from './schemas/detection.schema';
import { DetectionController } from './detections.controller';
import { DetectionService } from './detections.service';
import { DetectionClient } from './detection-client.service';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';
import { UserModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DetectionResult.name, schema: DetectionResultSchema },
    ]),
    // VerifyLogin injects UserService, so the guard needs it resolvable here.
    UserModule,
  ],
  controllers: [DetectionController],
  providers: [DetectionService, DetectionClient, VerifyLogin],
  exports: [MongooseModule],
})
export class DetectionModule {}
