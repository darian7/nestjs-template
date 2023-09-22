import { Injectable } from '@nestjs/common';

import { User } from '../../users/entities/user.entity';
import { UserRoleEnum } from '../enums/user-role.enum';
import { UserExistsException } from '../exeptions/user-exists-exceptions';
import { CreateUser } from '../interfaces/users.interface';
import { UserDoesNotExistException } from '../exeptions/user-does-not-exist-exceptions';

let users: User[] = [
  {
    email: 'darian7cc@gmail.com',
    fullName: 'Yojan',
    password: '12345',
    phone: '+573143927175',
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.CLIENT],
  },
];

@Injectable()
export class UsersService {
  constructor() {}

  createUser(user: CreateUser) {
    users.push(user);
    return user;
  }

  getUserByEmail(email: string) {
    const user = users.find((user) => user.email === email);

    if (!user) {
      throw new UserDoesNotExistException();
    }

    return user;
  }

  getUsers() {
    return users;
  }

  findUserManyByRole(role: UserRoleEnum) {
    return users.filter((user) => user.roles.includes(role));
  }

  checkEmailAvailability(email) {
    const userExists = users.some((user) => user.email == email);

    if (userExists) {
      throw new UserExistsException();
    }

    return userExists;
  }

  deleteUser(email) {
    users = users.filter((user) => user.email !== email);
    return { email };
  }
}
