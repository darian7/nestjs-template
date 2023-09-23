import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRoleEnum } from '../../../../modules/business/users/enums/user-role.enum';

export class UnauthorizedRoleException extends HttpException {
  constructor(private roles: UserRoleEnum[]) {
    super(
      `requiere roles [${roles?.map((rol) => rol)}]`,
      HttpStatus.UNAUTHORIZED,
    );
  }
}
