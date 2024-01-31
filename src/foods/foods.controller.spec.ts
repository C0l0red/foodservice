import { Test, TestingModule } from '@nestjs/testing';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { PrismaModule } from '../prisma/prisma.module';
import { mockCreateFoodDto, mockFoodDto } from '../../test/mocks';

describe('FoodsController', () => {
  let controller: FoodsController;
  let service: FoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [FoodsController],
      providers: [FoodsService],
    }).compile();

    controller = module.get<FoodsController>(FoodsController);
    service = module.get<FoodsService>(FoodsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call FoodService.create once', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockFoodDto);

      await controller.create(mockCreateFoodDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a FoodDto', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockFoodDto);

      await expect(controller.create(mockCreateFoodDto)).resolves.toEqual(
        mockFoodDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call FoodService.findAll once', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockFoodDto]);

      await controller.findAll();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a FoodDto', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockFoodDto]);

      await expect(controller.findAll()).resolves.toEqual([mockFoodDto]);
    });
  });

  describe('findOne', () => {
    it('should call FoodService.findOne once', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFoodDto);

      await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a FoodDto', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockFoodDto);

      await expect(controller.findOne('1')).resolves.toEqual(mockFoodDto);
    });
  });

  describe('update', () => {
    it('should call FoodService.update once', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockFoodDto);

      await controller.update(mockCreateFoodDto, '1');
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a FoodDto', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockFoodDto);

      await expect(controller.update(mockCreateFoodDto, '1')).resolves.toEqual(
        mockFoodDto,
      );
    });
  });

  describe('remove', () => {
    it('should call FoodService.remove once', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove('1');
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should resolve to undefined', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await expect(controller.remove('1')).resolves.toEqual(undefined);
    });
  });
});
