import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';

const APP_ROUTE_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
      forceCloseConnections: true,
    },
  );
  app.useLogger(app.get(Logger));
  app
    .enableVersioning({ type: VersioningType.URI, defaultVersion: '1' })
    .setGlobalPrefix(APP_ROUTE_PREFIX);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Rewards API')
    .setDescription('License rewards api services')
    .setVersion('1.0') // should be bumped after each change e.g: 1.1, 1.2....
    .build();

  /*const configV2 = new DocumentBuilder()
    .setTitle('Rewards API')
    .setDescription('License rewards api services')
    .setVersion('2.0')
    .build();*/

  const document = SwaggerModule.createDocument(app, config);
  //const documentV2 = SwaggerModule.createDocument(app, configV2);

  SwaggerModule.setup(`${APP_ROUTE_PREFIX}/v1/docs`, app, document);
  //SwaggerModule.setup(`${APP_ROUTE_PREFIX}/v2/docs`, app, documentV2);

  const port = app.get<ConfigService>(ConfigService).get<number>('port');

  await app.listen(port);
}

bootstrap();
