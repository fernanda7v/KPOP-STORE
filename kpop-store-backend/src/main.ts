import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function getAllowedOrigins() {
  const corsOrigin = process.env.CORS_ORIGIN;

  const localOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080',
  ];

  if (!corsOrigin) {
    return localOrigins;
  }

  const onlineOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...localOrigins, ...onlineOrigins];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();