import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './@common/interfaces/app.config.interfaces';
import { GlobalExceptionFilter } from './@common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const configApp = configService.get<AppConfig>('config');
  await app.listen(configApp?.server.port, () => {
    console.log('port listen:', configApp?.server.port);
  });
}
bootstrap();
