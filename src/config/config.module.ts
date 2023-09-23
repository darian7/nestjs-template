import { Module } from '@nestjs/common';
import { ConfigModule as ConfigNestModule } from '@nestjs/config';

import appConfig from './app-config/app.config';
import authenticationConfig from './authentication-config/authentication.config';
import { enviroments } from '../common/constans/enviroments';

@Module({
  imports: [
    ConfigNestModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [appConfig, authenticationConfig],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
