import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { LoginDto, RegisterDto } from './dto';
import { CustomException } from 'src/common/exception/custom.exception';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async signup(RegisterDto: RegisterDto) {
    try {
      const hashedPassword = await argon.hash(RegisterDto.password);

      const newUser = await this.prisma.user.create({
        data: {
          name: RegisterDto.name.trim(),
          email: RegisterDto.email.trim(),
          phone: RegisterDto.phone,
          password: hashedPassword,
        },
      });
      const { password, ...userDetails } = newUser;
      return { message: 'Registered Successfully', data: userDetails };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Already Taken');
        }
      }
      throw error;
    }
  }

  async login(LoginDto: LoginDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: LoginDto.input }, { phone: LoginDto.input }],
      },
    });
    if (!existingUser) {
      throw new CustomException('User not found', 409);
    }
    const validPassword = await argon.verify(
      existingUser.password,
      LoginDto.password,
    );
    if (!validPassword) {
      throw new CustomException('Invalid Credentials', 403);
    }
    return this.token(existingUser.id, existingUser.email);
  }
  async token(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secretKey = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secretKey,
    });
    return { access_token: token };
  }
}
