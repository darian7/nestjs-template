import { UserRoleEnum } from '../enums/user-role.enum';

export class User {
  fullName: string;

  password: string;

  email: string;

  phone: string;

  roles: UserRoleEnum[];
}
