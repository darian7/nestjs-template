import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../services/auth.service';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { IncorrectPasswordException } from '../exeptions/incorrect-password-exceptions';
import { UserDoesNotExistException } from '../../users/exeptions/user-does-not-exist-exceptions';
import {
  RequestUserEmailPasswordAuthGuard,
  Signup,
} from '../interfaces/auth.interface';
import { UserExistsException } from '../../users/exeptions/user-exists-exceptions';

describe('AuthService', () => {
  let service: AuthService;
  const mock: User = {
    email: 'paullet@gmail.com',
    fullName: 'Yojan',
    password: '12345',
    phone: '+573143927175',
    roles: [UserRoleEnum.CLIENT],
  };
  const mockUsersService = {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: new JwtService({
            secretOrPrivateKey: 'Secret key',
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined service', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      jest.spyOn(mockUsersService, 'getUserByEmail').mockReturnValue(mock);
      const user = await service.validateUser(mock.email, mock.password);
      expect(user).toEqual(mock);
    });

    it('should throw a IncorrectPasswordException if the password is incorrect', async () => {
      const incorrectPassword = '·$RTTT';
      await expect(() => {
        service.validateUser(mock.email, incorrectPassword);
      }).toThrow(IncorrectPasswordException);
    });

    it('should throw a User DoesNotExist Exception when the user with the email does not exist', async () => {
      jest.spyOn(mockUsersService, 'getUserByEmail').mockImplementation(() => {
        throw new UserDoesNotExistException();
      });

      await expect(() => {
        service.validateUser(mock.email, mock.password);
      }).toThrow(UserDoesNotExistException);
    });
  });

  describe('signupUser', () => {
    const signup: Signup = {
      email: mock.email,
      fullName: mock.fullName,
      password: mock.password,
      phone: mock.phone,
    };

    it('should create a user', async () => {
      jest.spyOn(mockUsersService, 'createUser').mockReturnValue(mock);
      const user = await service.signupUser(signup);
      expect(user).toEqual(mock);
    });

    it('should throw a UserExistsException if the email already exists', async () => {
      jest.spyOn(mockUsersService, 'createUser').mockImplementation(() => {
        throw new UserExistsException();
      });

      await expect(() => {
        service.signupUser(signup);
      }).toThrow(UserExistsException);
    });
  });

  describe('signIn', () => {
    it('should throw a jwt token', async () => {
      const req: RequestUserEmailPasswordAuthGuard = {
        user: {
          email: mock.email,
          roles: mock.roles,
        },
      };
      const signIn = await service.signIn(req);
      expect(typeof signIn?.access_token).toEqual('string');
    });
  });
});
