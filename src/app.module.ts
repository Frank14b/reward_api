import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import configuration, { DatabaseConfig } from './config/configuration';
import { validate } from './config/validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get<DatabaseConfig>('database'));

        return {
          uri: configService.get<DatabaseConfig>('database').uri,
          dbName: configService.get<DatabaseConfig>('database').dbName,
          auth: {
            username: configService.get<DatabaseConfig>('database').user,
            password: configService.get<DatabaseConfig>('database').pass,
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
