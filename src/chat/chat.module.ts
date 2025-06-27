import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LlmModule } from '../llm/llm.module';
import { DbIntrospectModule } from '../db-introspect/db-introspect.module';

@Module({
  imports: [LlmModule, DbIntrospectModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
