import { registerAs } from '@nestjs/config';
import { AppConfig } from '../interfaces/app.config.interfaces';

export default registerAs('config', (): AppConfig => {
  return {
    server: {
      port: +process.env.PORT_SERVER || 4000,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
});
