import { UserRoleEnum } from '../../users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  id: string;
  email: string;
  roles: [UserRoleEnum];
}

export interface RequestUserJwtAuthGuard {
  user: {
    id: string;
    email: string;
    roles: [UserRoleEnum];
  };
}

export interface RequestUserEmailPasswordAuthGuard {
  user: {
    id: string;
    email: string;
    roles: [UserRoleEnum];
  };
}

export interface Signup {
  email: string;
  fullName: string;
  password: string;
  phone: string;
}
