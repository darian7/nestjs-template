import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  Signup,
  RequestUserEmailPasswordAuthGuard,
  JwtPayload,
} from '../interfaces/auth.interface';
import { UsersService } from '../../users/services/users.service';
import { IncorrectPasswordException } from '../exeptions/incorrect-password-exceptions';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateUser(email: string, password: string) {
    const user = this.usersService.getUserByEmail(email);

    if (user.password !== password) {
      throw new IncorrectPasswordException();
    }

    return user;
  }

  signupUser(user: Signup) {
    return this.usersService.createUser({
      ...user,
      roles: [UserRoleEnum.CLIENT],
    });
  }

  async signIn({ user }: RequestUserEmailPasswordAuthGuard) {
    const payload: JwtPayload = {
      sub: user.email,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
