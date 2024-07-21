import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import express from 'express';

import { AppModule } from './app/app.module';
import { AppConfig } from '../../../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json());
  app.use(cookieParser());
  app.use(requestIp.mw());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  const port = AppConfig.general.backend.port;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: ${AppConfig.general.backend.baseUrl}/${globalPrefix}`
  );
}

bootstrap();
