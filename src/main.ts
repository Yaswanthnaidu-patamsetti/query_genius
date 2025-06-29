import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response } from 'express';
import axios from 'axios';
import * as cron from 'node-cron';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().get('/health', (req: Request, res: Response) => {
    res.status(200).send({ status: 'ok' });
  });
  await app.listen(process.env.PORT ?? 3000);
  const appUrl = process.env.APP_URL;

  if (appUrl) {
    cron.schedule('*/10 * * * *', async () => {
      try {
        const res = await axios.get(`${appUrl}/health`);
        console.log(`[CRON] Self-ping successful: ${res.status}`);
      } catch (err) {
        console.error('[CRON] Self-ping failed:', err.message);
      }
    });
  } else {
    console.warn('APP_URL not set — self-ping cron will not run.');
  }
}
bootstrap();
