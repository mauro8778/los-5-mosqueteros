import { existsSync } from 'fs';
import { resolve } from 'path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath) && typeof (process as any).loadEnvFile === 'function') {
  (process as any).loadEnvFile(envPath);
}

async function bootstrap() {
  const logger = new Logger('Los5Mosqueteros');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Validaciones globales estrictas mediante DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Documentación interactiva Swagger / OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('🐾 Los 5 Mosqueteros API')
    .setDescription(
      'Plataforma Integral de Rescate, Adopción Animal con IA, Cuidado Veterinario y Tienda Solidaria.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`========================================================`);
  logger.log(`🚀 Los 5 Mosqueteros API escuchando en el puerto ${port}`);
  logger.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/docs`);
  logger.log(`========================================================`);
}

bootstrap();
