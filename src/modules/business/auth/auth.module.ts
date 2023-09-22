import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '../../../config/app-config/interfaces/app.config.interfaces';
import { EmailPasswordStrategy } from './strategys/email-password.strategy';
import { JwtStrategy } from './strategys/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const configApp = configService.get<AppConfig>('config');
        return {
          global: true,
          secret: configApp.jwt.secret,
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
