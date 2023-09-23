import { Module } from '@nestjs/common';

import { BusinessModules } from '../business/modules';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule, ...BusinessModules],
})
export class AppModule {}
