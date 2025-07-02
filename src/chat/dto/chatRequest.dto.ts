import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
  @ApiProperty({ example: 'Hello,how are you/list of products' })
  @IsString()
  @IsNotEmpty()
  question: string;
  @ApiProperty({ example: 'chocolates/products' })
  @Optional()
  @IsString()
  @IsNotEmpty()
  targetTableName: string;
}
