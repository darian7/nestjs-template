import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RequestUserEmailPassword } from '../interfaces/auth.interface';

@Injectable()
export class EmailPasswordStrategy extends PassportStrategy(
  Strategy,
  'email-password',
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<RequestUserEmailPassword> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { email: user.email, roles: user.roles };
  }
}
