import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import authenticationConfig from '../../../../config/authentication-config/authentication.config';
import { JwtPayload, RequestUserJwt } from '../interfaces/auth.interface';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authenticationConfig.KEY)
    private configApp: ConfigType<typeof authenticationConfig>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configApp.jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUserJwt> {
    let user;
    try {
      user = await this.usersService.getUserByEmail(payload.sub);
    } catch (error) {}

    if (!user) {
      throw new UnauthorizedException();
    }

    return { email: payload.sub, roles: payload.roles };
  }
}
