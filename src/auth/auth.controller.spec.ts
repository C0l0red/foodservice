import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login.response.dto';
import { mockCurrentUserDto } from '../../test/mocks';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const loginResponseDto: LoginResponseDto = {
    token: 'token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.login once', async () => {
      jest.spyOn(service, 'login').mockResolvedValue(loginResponseDto);

      await controller.login(mockCurrentUserDto);
      expect(service.login).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a LoginResponseDto', async () => {
      jest.spyOn(service, 'login').mockResolvedValue(loginResponseDto);

      await expect(controller.login(mockCurrentUserDto)).resolves.toEqual(
        loginResponseDto,
      );
    });
  });
});
