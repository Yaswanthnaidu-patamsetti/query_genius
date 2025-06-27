import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @Optional()
  @IsString()
  @IsNotEmpty()
  targetTableName: string;
}
