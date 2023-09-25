import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from '../services/users.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { User } from '../entities/user.entity';
import { UsersController } from '../controllers/users.controller';
import { RequestUserJwtAuthGuard } from '../../auth/interfaces/auth.interface';
import { UserDoesNotExistException } from '../exeptions/user-does-not-exist-exceptions';

describe('UsersController', () => {
  let controller: UsersController;

  const mock: User = {
    email: 'paullet@gmail.com',
    fullName: 'Yojan',
    password: '12345',
    phone: '+573143927175',
    roles: [UserRoleEnum.CLIENT],
  };

  const mockUsersService = {
    getUserByEmail: jest.fn(),
    getUsers: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should find a user by a given id and return its data', async () => {
      jest.spyOn(mockUsersService, 'getUserByEmail').mockReturnValue(mock);

      const req: RequestUserJwtAuthGuard = {
        user: {
          email: mock.email,
          roles: mock.roles,
        },
      };
      const user = await controller.getUser(req);

      expect(user).toEqual(mock);
      expect(mockUsersService.getUserByEmail).toBeCalled();
      expect(mockUsersService.getUserByEmail).toBeCalledWith(mock.email);
    });

    it('should throw a User DoesNotExist Exception when the user with the email does not exist', async () => {
      jest.spyOn(mockUsersService, 'getUserByEmail').mockImplementation(() => {
        throw new UserDoesNotExistException();
      });

      const req: RequestUserJwtAuthGuard = {
        user: {
          email: mock.email,
          roles: mock.roles,
        },
      };

      await expect(() => {
        controller.getUser(req);
      }).toThrow(UserDoesNotExistException);
    });
  });

  describe('getUsers', () => {
    it('should find many user', async () => {
      const mocks = [mock];
      jest.spyOn(mockUsersService, 'getUsers').mockReturnValue(mocks);

      const users = await controller.getUsers();

      expect(users).toEqual(mocks);
      expect(mockUsersService.getUsers).toBeCalled();
      expect(mockUsersService.getUsers).toBeCalledWith();
    });

    it('should return an empty array of user', async () => {
      const mocks = [];
      jest.spyOn(mockUsersService, 'getUsers').mockReturnValue(mocks);
      expect(controller.getUsers()).toEqual(mocks);
    });
  });

  describe('deleteByUserId', () => {
    it('should delete a user by email', async () => {
      jest.spyOn(mockUsersService, 'deleteUser').mockReturnValue({
        email: mock.email,
      });

      const response = await controller.deleteByUserEmail(mock.email);

      expect(response).toEqual({
        email: mock.email,
      });
      expect(mockUsersService.deleteUser).toBeCalled();
      expect(mockUsersService.deleteUser).toBeCalledWith(mock.email);
    });

    it('should throw a UserDoesNotExistException when the user with the email does not exist', async () => {
      jest.spyOn(mockUsersService, 'deleteUser').mockImplementation(() => {
        throw new UserDoesNotExistException();
      });

      await expect(() => {
        controller.deleteByUserEmail(mock.email);
      }).toThrow(UserDoesNotExistException);
    });
  });
});
