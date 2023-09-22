import { UserRoleEnum } from '../enums/user-role.enum';

export interface CreateUser {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  roles: UserRoleEnum[];
}
