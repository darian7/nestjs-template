import { registerAs } from '@nestjs/config';
import { AppConfig } from './interfaces/app.config.interfaces';

export default registerAs('app', (): AppConfig => {
  return {
    server: {
      port: +process.env.PORT_SERVER || 4000,
    },
  };
});
