import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../services/users.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { User } from '../entities/user.entity';
import { UserExistsException } from '../exeptions/user-exists-exceptions';
import { UserDoesNotExistException } from '../exeptions/user-does-not-exist-exceptions';

describe('UsersService', () => {
  let service: UsersService;
  const mock: User = {
    email: 'paullet@gmail.com',
    fullName: 'Yojan',
    password: '12345',
    phone: '+573143927175',
    roles: [UserRoleEnum.CLIENT],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const result = await service.createUser(mock);
      expect(result).toEqual(mock);
    });

    it('should throw a UserExistsException when a user with the same email already exists', async () => {
      await expect(() => {
        service.createUser(mock);
      }).toThrow(UserExistsException);
    });
  });

  describe('getUserByEmail', () => {
    it('should return by email a user ', async () => {
      const user = await service.getUserByEmail(mock.email);
      expect(user).toEqual(mock);
    });

    it('should throw a UserDoesNotExistException when the user with the email does not exist', async () => {
      await expect(() => {
        const nonExistentEmail = 'mock@gmail.com';
        service.getUserByEmail(nonExistentEmail);
      }).toThrow(UserDoesNotExistException);
    });
  });

  describe('getUsers', () => {
    it('should return an array of users', () => {
      const users = service.getUsers();
      expect(Array.isArray(users)).toBe(true);
    });

    it('should return an array of user', async () => {
      const mocks = [mock, mock];
      jest.spyOn(service, 'getUsers').mockReturnValue(mocks);

      const users = await service.getUsers();

      expect(users).toEqual(mocks);
    });

    it('should return an empty array of user', async () => {
      const mocks = [];
      jest.spyOn(service, 'getUsers').mockReturnValue(mocks);
      const users = await service.getUsers();
      expect(users).toEqual(mocks);
    });
  });

  describe('findUserManyByRole', () => {
    it('should return an array of users', () => {
      const users = service.findUserManyByRole(mock.roles[0]);
      expect(Array.isArray(users)).toBe(true);
    });

    it('should return an array of user', async () => {
      const mocks = [mock];
      jest.spyOn(service, 'findUserManyByRole').mockReturnValue(mocks);

      const users = await service.findUserManyByRole(mock.roles[0]);

      expect(users).toEqual(mocks);
    });

    it('should return an empty array of user', async () => {
      const mocks = [];
      jest.spyOn(service, 'findUserManyByRole').mockReturnValue(mocks);
      const users = await service.findUserManyByRole(mock.roles[0]);
      expect(users).toEqual(mocks);
    });
  });

  describe('checkEmailAvailability', () => {
    it('should create a new user', async () => {
      const nonExistentEmail = 'mock@gmail.com';
      const result = await service.checkEmailAvailability(nonExistentEmail);
      expect(result).toEqual(true);
    });

    it('should throw a UserExistsException when a user with the same email already exists', async () => {
      await expect(() => {
        service.checkEmailAvailability(mock.email);
      }).toThrow(UserExistsException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = await service.deleteUser(mock.email);
      expect(result.email).toEqual(mock.email);
    });

    it('should throw a UserDoesNotExistException when the user with the email does not exist', async () => {
      await expect(() => {
        service.deleteUser(mock.email);
      }).toThrow(UserDoesNotExistException);
    });
  });
});
