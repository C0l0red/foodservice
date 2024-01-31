import { Test, TestingModule } from '@nestjs/testing';
import { FoodsService } from './foods.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { mockCreateFoodDto, mockFood } from '../../test/mocks';

describe('FoodsService', () => {
  let service: FoodsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [FoodsService],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call PrismaService.food.create once', async () => {
      jest.spyOn(prisma.food, 'create').mockResolvedValue(mockFood);

      await service.create(mockCreateFoodDto);
      expect(prisma.food.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call PrismaService.food.findMany once', async () => {
      jest.spyOn(prisma.food, 'findMany').mockResolvedValue([mockFood]);

      await service.findAll();
      expect(prisma.food.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should call PrismaService.food.findUniqueOrThrow once', async () => {
      jest.spyOn(prisma.food, 'findUniqueOrThrow').mockResolvedValue(mockFood);

      await service.findOne('1');
      expect(prisma.food.findUniqueOrThrow).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call PrismaService.food.update once', async () => {
      jest.spyOn(prisma.food, 'update').mockResolvedValue(mockFood);

      await service.update(mockCreateFoodDto, '1');
      expect(prisma.food.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should call PrismaService.food.delete once', async () => {
      jest.spyOn(prisma.food, 'delete').mockResolvedValue(mockFood);

      await service.remove('1');
      expect(prisma.food.delete).toHaveBeenCalledTimes(1);
    });
  });
});
