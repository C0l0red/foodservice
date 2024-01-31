import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import {
  mockCreateOrderDto,
  mockCurrentUserDto,
  mockFood,
  mockOrder,
} from '../../test/mocks';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call PrismaService.order.create once', async () => {
      jest.spyOn(prisma.order, 'create').mockResolvedValue(mockOrder);
      jest.spyOn(prisma.food, 'findMany').mockResolvedValue([mockFood]);

      await service.create(mockCreateOrderDto, mockCurrentUserDto);
      expect(prisma.order.create).toHaveBeenCalledTimes(1);
    });

    it('should call PrismaService.food.findMany once', async () => {
      jest.spyOn(prisma.order, 'create').mockResolvedValue(mockOrder);
      jest.spyOn(prisma.food, 'findMany').mockResolvedValue([mockFood]);

      await service.create(mockCreateOrderDto, mockCurrentUserDto);
      expect(prisma.food.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call PrismaService.order.findMany once', async () => {
      jest.spyOn(prisma.order, 'findMany').mockResolvedValue([mockOrder]);

      await service.findAll(mockCurrentUserDto);
      expect(prisma.order.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should call PrismaService.order.findUniqueOrThrow once', async () => {
      jest
        .spyOn(prisma.order, 'findUniqueOrThrow')
        .mockResolvedValue(mockOrder);

      await service.findOne('1', mockCurrentUserDto);
      expect(prisma.order.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });
});
