import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CohereClientV2 } from 'cohere-ai';
import {
  classificationPromptTemplate,
  genericChatPromptTemplate,
  noDataFallbackPrompt,
} from './prompt.templates';
import { sqlGenerationPrompt } from './sql-generator';

@Injectable()
export class LlmService {
  private cohere: CohereClientV2;
  constructor(private config: ConfigService) {
    this.cohere = new CohereClientV2({
      token: this.config.get('COHERE_API_KEY'),
    });
  }
  private async chatWithCohere(prompt: string): Promise<string> {
    const response = await this.cohere.chat({
      model: 'command-r-plus',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response?.message?.content?.[0]?.text?.trim();
    if (!content) {
      throw new Error('No content found in the response.');
    }

    return content;
  }

  async classifyQuestion(question: string): Promise<boolean> {
    const prompt = classificationPromptTemplate(question);
    const aiResponse = await this.chatWithCohere(prompt);
    return aiResponse.toLowerCase().includes('true');
  }

  async generateSQL(
    question: string,
    schema: { table: string; columns }[],
  ): Promise<string> {
    const prompt = sqlGenerationPrompt(question, schema);
    let aiResponse = await this.chatWithCohere(prompt);
    if (aiResponse?.startsWith('```')) {
      aiResponse = aiResponse.replace(/```sql|```/gi, '').trim();
    }

    return aiResponse;
  }

  async genericQuestionProcessor(question: string): Promise<string> {
    const prompt = genericChatPromptTemplate(question);
    const aiResponse = await this.chatWithCohere(prompt);
    return aiResponse;
  }
  async NoDataFoundProcessor(question: string): Promise<string> {
    const prompt = noDataFallbackPrompt(question);
    const aiResponse = await this.chatWithCohere(prompt);
    return aiResponse;
  }
}
