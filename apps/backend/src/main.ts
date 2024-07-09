import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import { AppConfig } from '../../../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppConfig.general.backend.port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: ${AppConfig.general.backend.baseUrl}/${globalPrefix}`
  );
}

bootstrap();
