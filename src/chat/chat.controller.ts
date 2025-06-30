import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto';

import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @HttpCode(200)
  @Post('question')
  async question(@GetUser('') user, @Body() ChatRequestDto: ChatRequestDto) {
    return await this.chatService.processQuestion(
      user.userId,
      ChatRequestDto.question,
      ChatRequestDto.targetTableName,
    );
  }

  @Get('history')
  async fetchChat(
    @GetUser('') user,
    @Query('page') page = 1,
    @Query('limit') limit = 1,
  ) {
    return await this.chatService.fetchChat(user.userId, +page, +limit);
  }

  @Delete('reset')
  async resetChat(@GetUser('') user) {
    return await this.chatService.clearChat(user.userId);
  }
}
