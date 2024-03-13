import * as path from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { LoggerModule } from 'nestjs-pino';
import { TransportTargetOptions, pino } from 'pino';

import configuration, { DatabaseConfig } from './v1/config/configuration';
import { validate } from './v1/config/validator';
import { UsersModule } from './v1/users/users.module';

const targets: Array<TransportTargetOptions> = [
  {
    target: path.resolve('./src/common/loggers/info-transport-stream.js'),
    level: 'info',
    options: {
      version: 1, //api version
    },
  },
  {
    target: path.resolve('./src/common/loggers/error-transport-stream.js'),
    level: 'error',
    options: {
      version: 1, //api version
    },
  },
];

if (process.env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
  });
}

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/common/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          bindings: (bindings) => ({
            pid: bindings.pid,
            host: bindings.hostname,
            node_version: process.version,
          }),
        },
        transport: {
          targets,
        },
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<DatabaseConfig>('database').uri,
        dbName: configService.get<DatabaseConfig>('database').dbName,
        auth: {
          username: configService.get<DatabaseConfig>('database').user,
          password: configService.get<DatabaseConfig>('database').pass,
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
