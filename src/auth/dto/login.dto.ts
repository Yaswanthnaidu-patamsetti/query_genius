import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Email or Password required' })
  input: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
