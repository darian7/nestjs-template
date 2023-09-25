import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '../controllers/auth.controller';
import { UserRoleEnum } from '../../users/enums/user-role.enum';
import { User } from '../../users/entities/user.entity';
import { SignupUserDto } from '../dto/auth-signup.dto';
import { AuthService } from '../services/auth.service';
import { UserExistsException } from '../../users/exeptions/user-exists-exceptions';
import {
  JwtPayload,
  RequestUserEmailPasswordAuthGuard,
} from '../interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;

  const mock: User = {
    email: 'paullet@gmail.com',
    fullName: 'Yojan',
    password: '12345',
    phone: '+573143927175',
    roles: [UserRoleEnum.CLIENT],
  };

  const mockAuthService = {
    signupUser: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: new JwtService({
            secretOrPrivateKey: 'Secret key',
          }),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined controller', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupUser: SignupUserDto = {
      email: mock.email,
      fullName: mock.fullName,
      password: mock.password,
      phone: mock.phone,
    };

    it('should register a user and return their data', async () => {
      jest.spyOn(mockAuthService, 'signupUser').mockReturnValue(mock);

      const user = await controller.signup(signupUser);

      expect(user).toEqual(mock);
      expect(mockAuthService.signupUser).toBeCalled();
      expect(mockAuthService.signupUser).toBeCalledWith(signupUser);
    });

    it('should throw a UserExistsException if the email already exists', async () => {
      jest.spyOn(mockAuthService, 'signupUser').mockImplementation(() => {
        throw new UserExistsException();
      });

      await expect(controller.signup(signupUser)).rejects.toThrow(
        UserExistsException,
      );
    });
  });

  describe('login', () => {
    it('should generate token', async () => {
      const req: RequestUserEmailPasswordAuthGuard = {
        user: {
          email: mock.email,
          roles: mock.roles,
        },
      };

      const payload: JwtPayload = {
        sub: mock.email,
        email: mock.email,
        roles: mock.roles,
      };

      const access_token = await jwtService.signAsync(payload);
      jest.spyOn(mockAuthService, 'signIn').mockResolvedValue({
        access_token,
      });

      const signIn = await controller.login(req);

      expect(typeof signIn?.access_token).toEqual('string');
      expect(mockAuthService.signIn).toBeCalled();
      expect(mockAuthService.signIn).toBeCalledWith(req);

      const decodedToken = jwtService.decode(signIn.access_token);
      expect(decodedToken).toMatchObject({
        sub: mock.email,
        email: mock.email,
        roles: mock.roles,
      });
    });
  });
});
