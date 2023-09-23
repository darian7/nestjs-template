import { registerAs } from '@nestjs/config';
import { AuthenticationConfig } from './interfaces/authentication.config.interfaces';

export default registerAs('authentication', (): AuthenticationConfig => {
  return {
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
});
