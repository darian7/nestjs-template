import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestUserJwtAuthGuard } from '../../modules/business/auth/interfaces/auth.interface';
import { UserRoleEnum } from '../../modules/business/users/enums/user-role.enum';
import { UnauthorizedRoleException } from '../exeptions/unauthorized-role.exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    const { user } = context
      .switchToHttp()
      .getRequest() as RequestUserJwtAuthGuard;

    const acces = requiredRoles.some((role) => user.roles?.includes(role));

    if (!acces) {
      throw new UnauthorizedRoleException(requiredRoles);
    }

    return true;
  }
}
