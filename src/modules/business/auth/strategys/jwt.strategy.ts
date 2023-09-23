import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import authenticationConfig from '../../../../config/authentication-config/authentication.config';
import { JwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authenticationConfig.KEY)
    private configApp: ConfigType<typeof authenticationConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configApp.jwt.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, ...payload };
  }
}
