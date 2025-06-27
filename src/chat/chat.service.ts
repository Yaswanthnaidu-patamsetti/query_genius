import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LlmService } from '../llm/llm.service';
import { DbIntrospectService } from '../db-introspect/db-introspect.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private llm: LlmService,
    private dbintroSpec: DbIntrospectService,
  ) {}
  async processQuestion(
    userId: number,
    question: string,
    targetTableName?: string,
  ) {
    try {
      if (!question || question === '') {
        return {
          message: `Hi there! I'm 🤖Query-Genius🤖; I'm here to assist in any way I can. How can I help you today?`,
        };
      }
      const restrictedTables = ['_prisma_migrations', 'users', 'questions'];

      if (targetTableName && restrictedTables.includes(targetTableName)) {
        return {
          type: 'restricted',
          message: `Access to information about the "${targetTableName}" data is restricted.`,
        };
      }
      const isDbrelated = await this.classifyQuestion(question);

      const saveQuestion = async (
        isDbRealted: boolean,
        llmResponse: any,
        generatedSql?: string,
      ) => {
        await this.prisma.question.create({
          data: {
            userId,
            questionText: question,
            isDbRealted,
            generatedSql,
            llmResponse: JSON.stringify(llmResponse),
          },
        });
      };

      if (!isDbrelated) {
        const genericAnswer = await this.genericQuestionHandler(question);
        await saveQuestion(false, genericAnswer);
        return {
          type: 'generic',

          response: genericAnswer,
        };
      }
      const fetchschema =
        await this.dbintroSpec.getSchemaDetails(targetTableName);

      const sqlQuery = await this.llm.generateSQL(question, fetchschema);

      const rawResult = await this.prisma.$queryRawUnsafe<any[]>(sqlQuery);
      const result = rawResult.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key,
            typeof value === 'bigint' ? Number(value) : value,
          ]),
        ),
      );

      if (result.length === 0) {
        const fallbackResponse = await this.llm.NoDataFoundProcessor(question);
        await saveQuestion(true, fallbackResponse, sqlQuery);
        return {
          type: 'noData',
          response: fallbackResponse,
        };
      }
      await saveQuestion(true, result, sqlQuery);
      return {
        type: 'data',
        response: result,
      };
    } catch (error) {
      console.log(error);
      throw new Error(
        'Unable to process your request,Please try after some time',
      );
    }
  }

  async fetchChat(userId: number, page = 1, limit = 1) {
    try {
      const skip = (page - 1) * limit;
      const chat = await this.prisma.question.findMany({
        where: { userId },
        skip,
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: { questionText: true, isDbRealted: true, llmResponse: true },
      });
      if (chat.length == 0) {
        return { message: 'No chat available!' };
      }
      return { message: 'Fetched Chat', data: chat };
    } catch (error) {}
  }

  async clearChat(userId: number) {
    try {
      const result = await this.prisma.question.deleteMany({
        where: { userId },
      });
      if (result.count === 0) {
        return { message: 'No chat history found to delete.' };
      }

      return { message: 'Chat history cleared successfully.' };
    } catch (error) {
      throw new Error(error);
    }
  }

  async classifyQuestion(question: string): Promise<boolean> {
    return this.llm.classifyQuestion(question);
  }
  async genericQuestionHandler(question: string): Promise<string> {
    return this.llm.genericQuestionProcessor(question);
  }
}
