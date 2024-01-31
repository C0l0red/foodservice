import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import {
  mockCreateUserDto,
  mockCurrentUserDto,
  mockUser,
} from '../../test/mocks';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call PrismaService.user.create once', async () => {
      jest.spyOn(prisma.user, 'create').mockResolvedValue(mockUser);

      await service.create(mockCreateUserDto);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getProfile', () => {
    it('should call PrismaService.user.findUniqueOrThrow once', async () => {
      jest.spyOn(prisma.user, 'findUniqueOrThrow').mockResolvedValue(mockUser);

      await service.getProfile(mockCurrentUserDto);
      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByEmailOrUsername', () => {
    it('should call PrismaService.user.findFirst once', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);

      await service.findByEmailOrUsername('email', 'username');
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('verifyPassword', () => {
    const user: Partial<User> = {
      password: bcrypt.hashSync('password', 10),
    };
    it('should resolve to true with correct password', async () => {
      await expect(service.verifyPassword(user, 'password')).resolves.toEqual(
        true,
      );
    });
    it('should resolve to false with incorrect password', async () => {
      await expect(
        service.verifyPassword(user, 'wrong password'),
      ).resolves.toEqual(false);
    });
  });
});
