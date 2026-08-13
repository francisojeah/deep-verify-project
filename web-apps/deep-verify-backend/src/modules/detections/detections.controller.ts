import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';
import { DetectionService } from './detections.service';

const MAX_BYTES = 10 * 1024 * 1024;

@ApiTags('detection')
@ApiBearerAuth()
@Controller('detection')
@UseGuards(VerifyLogin)
export class DetectionController {
  constructor(private detectionService: DetectionService) {}

  @Version('1')
  @Post('detect/:inputType')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_BYTES } }))
  async detectDeepfake(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return this.detectionService.detectDeepfake(file, req.user._id);
  }

  @Version('1')
  @Get('detection-history')
  async getDetectionHistory(@Req() req: any) {
    return this.detectionService.getDetectionHistory(req.user._id);
  }

  @Version('1')
  @Get('detection/:id')
  async getDetectionDetails(@Param('id') id: string, @Req() req: any) {
    const detection = await this.detectionService.getDetectionDetails(id, req.user._id);
    if (!detection) {
      throw new NotFoundException('Detection not found');
    }
    return detection;
  }
}
