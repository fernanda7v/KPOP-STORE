import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080',
    'https://kpop-store-kappa.vercel.app',
  ];

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  if (origin.endsWith('.vercel.app')) {
    return true;
  }

  return false;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origen no permitido por CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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