import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4001);
}
bootstrap();
