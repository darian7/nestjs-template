import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { EmailPasswordStrategy } from './strategys/email-password.strategy';
import { JwtStrategy } from './strategys/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { AuthenticationConfig } from '../../../config/authentication-config/interfaces/authentication.config.interfaces';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const authenticationConfig =
          configService.get<AuthenticationConfig>('authentication');
        return {
          global: true,
          secret: authenticationConfig.jwt.secret,
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, EmailPasswordStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
