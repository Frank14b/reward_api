import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const APP_ROUTE_PREFIX = 'api';
const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app
    .enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
    .setGlobalPrefix(APP_ROUTE_PREFIX);

  const config = new DocumentBuilder()
    .setTitle('Rewards API')
    .setDescription('License rewards api services')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${APP_ROUTE_PREFIX}/:version/docs`, app, document);

  await app.listen(PORT);
}

bootstrap();
