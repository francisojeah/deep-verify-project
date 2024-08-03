import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-detection.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
