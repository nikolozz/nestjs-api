import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { runInCluster } from './runInCluster';
import rawBodyMiddleware from './utils/middleware/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.use(rawBodyMiddleware());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors({
    origin: configService.get('FRONTEND_URL'),
    credentials: true,
  });

  const PORT = configService.get('PORT');
  await app.listen(PORT);
}
process.env.NODE_ENV === 'development' ? bootstrap() : runInCluster(bootstrap);
