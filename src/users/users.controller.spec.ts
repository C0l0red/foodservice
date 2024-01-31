import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import {
  mockCreateUserDto,
  mockCurrentUserDto,
  mockUserDto,
} from '../../test/mocks';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call UsersService.create once', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockUserDto);

      await controller.create(mockCreateUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should return a User object', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockUserDto);
      await expect(controller.create(mockCreateUserDto)).resolves.toEqual(
        mockUserDto,
      );
    });
  });

  describe('getProfile', () => {
    it('should call UsersService.getProfile once', async () => {
      jest.spyOn(service, 'getProfile').mockResolvedValue(mockUserDto);
      await controller.getProfile(mockCurrentUserDto);

      expect(service.getProfile).toHaveBeenCalledTimes(1);
    });

    it('should return a User object', async () => {
      jest.spyOn(service, 'getProfile').mockResolvedValue(mockUserDto);
      await expect(controller.getProfile(mockCurrentUserDto)).resolves.toEqual(
        mockUserDto,
      );
    });
  });
});
