import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'dexter' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'dexter@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ example: '9876543211' })
  @IsString()
  @IsNotEmpty()
  phone: string;
  @ApiProperty({ example: 'dexter123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
