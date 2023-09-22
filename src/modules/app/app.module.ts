import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BusinessModules } from '../business/modules';
import { enviroments } from '../../@common/config/constans/constans';
import config from '../../@common/config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    ...BusinessModules,
  ],
})
export class AppModule {}
