import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'dexter@gmail.com or 9876543211' })
  @IsString()
  @IsNotEmpty({ message: 'Email or Password required' })
  input: string;
  @ApiProperty({ example: 'dexter123456' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
