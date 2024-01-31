import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../../users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { mockCurrentUserDto, mockUser } from '../../../test/mocks';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call UsersService.findByEmailOrUsername once', async () => {
      jest
        .spyOn(usersService, 'findByEmailOrUsername')
        .mockResolvedValue(mockUser);

      await service.validateUser('email', 'password');
      expect(usersService.findByEmailOrUsername).toHaveBeenCalledTimes(1);
    });
    it('should call UsersService.verifyPassword once', async () => {
      jest
        .spyOn(usersService, 'findByEmailOrUsername')
        .mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValue(true);

      await service.validateUser('email', 'password');
      expect(usersService.verifyPassword).toHaveBeenCalledTimes(1);
    });
    it('should return user if credentials are valid', async () => {
      jest
        .spyOn(usersService, 'findByEmailOrUsername')
        .mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValue(true);

      await expect(service.validateUser('email', 'password')).resolves.toEqual(
        mockUser,
      );
    });
    it('should return null if credentials are invalid', async () => {
      jest
        .spyOn(usersService, 'findByEmailOrUsername')
        .mockResolvedValue(mockUser);
      jest.spyOn(usersService, 'verifyPassword').mockResolvedValue(false);

      await expect(service.validateUser('email', 'password')).resolves.toEqual(
        null,
      );
    });
  });

  describe('login', () => {
    it('should call JwtService.sign once', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      await service.login(mockCurrentUserDto);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });
    it('should resolve to a LoginResponse', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      await expect(service.login(mockCurrentUserDto)).resolves.toEqual({
        token: 'token',
      });
    });
  });
});
