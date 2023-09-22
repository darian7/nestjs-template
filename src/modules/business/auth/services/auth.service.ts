import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  Signup,
  RequestUserEmailPasswordAuthGuard,
} from '../interfaces/auth.interface';
import { UsersService } from '../../users/services/users.service';
import { IncorrectPasswordException } from '../exeptions/incorrect password-exceptions';
import { UserRoleEnum } from '../../users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);

    if (user.password !== password) {
      throw new IncorrectPasswordException();
    }

    return user;
  }

  async signupUser(user: Signup) {
    await this.usersService.checkEmailAvailability(user?.email);
    return await this.usersService.createUser({
      ...user,
      roles: [UserRoleEnum.CLIENT],
    });
  }

  async signIn({ user }: RequestUserEmailPasswordAuthGuard) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
