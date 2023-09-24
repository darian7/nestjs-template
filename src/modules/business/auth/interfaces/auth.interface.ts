import { UserRoleEnum } from '../../users/enums/user-role.enum';

/* JWT */
export interface JwtPayload {
  sub: string;
  email: string;
  roles: UserRoleEnum[];
}

export interface RequestUserJwt {
  email: string;
  roles: UserRoleEnum[];
}

export interface RequestUserJwtAuthGuard {
  user: RequestUserJwt;
}

/* email-password authGuard */
export interface RequestUserEmailPassword {
  email: string;
  roles: UserRoleEnum[];
}

export interface RequestUserEmailPasswordAuthGuard {
  user: RequestUserEmailPassword;
}

export interface Signup {
  email: string;
  fullName: string;
  password: string;
  phone: string;
}
