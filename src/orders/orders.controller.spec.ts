import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import {
  mockCreateOrderDto,
  mockCurrentUserDto,
  mockOrderDto,
  mockOrdersService,
} from '../../test/mocks';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    })
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call OrderService.create once', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockOrderDto);

      await controller.create(mockCreateOrderDto, mockCurrentUserDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should resolve to an OrderDto', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockOrderDto);

      await expect(
        controller.create(mockCreateOrderDto, mockCurrentUserDto),
      ).resolves.toEqual(mockOrderDto);
    });
  });

  describe('findAll', () => {
    it('should call OrderService.findAll once', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockOrderDto]);

      await controller.findAll(mockCurrentUserDto);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should resolve to a list of OrderDto', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockOrderDto]);

      await expect(controller.findAll(mockCurrentUserDto)).resolves.toEqual([
        mockOrderDto,
      ]);
    });
  });

  describe('findOne', () => {
    it('should call OrderService.findOne once', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderDto);

      await controller.findOne('1', mockCurrentUserDto);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should resolve to an OrderDto', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockOrderDto);

      await expect(
        controller.findOne('1', mockCurrentUserDto),
      ).resolves.toEqual(mockOrderDto);
    });
  });
});
