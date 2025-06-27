export class ChatResponseDto {
  type: 'generic' | 'db';
  message: string | object;
}
