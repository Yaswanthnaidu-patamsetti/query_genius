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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('chat')
@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @HttpCode(200)
  @Post('question')
  @ApiOperation({ summary: 'Ask query' })
  @ApiResponse({ status: 200, description: 'returns generic response or data' })
  @ApiUnauthorizedResponse({
    description: 'Invalid token or token not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async question(@GetUser('') user, @Body() ChatRequestDto: ChatRequestDto) {
    return await this.chatService.processQuestion(
      user.userId,
      ChatRequestDto.question,
      ChatRequestDto.targetTableName,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Fetch user Chat History' })
  @ApiResponse({
    status: 200,
    description:
      'returns user chat,[{questionText:"",llmResponse:"",isDbRelated:true/false}]',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token or token not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async fetchChat(
    @GetUser('') user,
    @Query('page') page = 1,
    @Query('limit') limit = 1,
  ) {
    return await this.chatService.fetchChat(user.userId, +page, +limit);
  }

  @Delete('reset')
  @ApiOperation({ summary: 'Clear chat' })
  @ApiResponse({ status: 200, description: 'deletes the user chat history' })
  @ApiUnauthorizedResponse({
    description: 'Invalid token or token not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async resetChat(@GetUser('') user) {
    return await this.chatService.clearChat(user.userId);
  }
}
