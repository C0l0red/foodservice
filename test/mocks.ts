import { UsersService } from '../src/users/users.service';
import { OrdersService } from '../src/orders/orders.service';
import { CurrentUserDto } from '../src/common/dto/current-user.dto';
import { Food, Order, Role, User } from '@prisma/client';
import { UserDto } from '../src/users/dto/user.dto';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';
import { OrderDto } from '../src/orders/dto/order.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateFoodDto } from '../src/foods/dto/create-food.dto';
import { FoodDto } from '../src/foods/dto/food.dto';

export const mockUsersService: UsersService = {
  create: jest.fn().mockResolvedValue({}),
  getProfile: jest.fn().mockResolvedValue({}),
  findByEmailOrUsername: jest.fn().mockResolvedValue({}),
  verifyPassword: jest.fn().mockResolvedValue({}),
} as unknown as UsersService;

export const mockOrdersService: OrdersService = {
  create: jest.fn().mockResolvedValue({}),
  findOne: jest.fn().mockResolvedValue({}),
  findAll: jest.fn().mockResolvedValue({}),
} as unknown as OrdersService;

const datesMixin = {
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockCurrentUserDto: CurrentUserDto = {
  id: '1',
  role: Role.USER,
  username: 'test',
};

export const mockCreateUserDto = {
  role: Role.USER,
  email: 'test@gmail.com',
  username: 'test',
  password: 'password',
};

export const mockUserDto: UserDto = {
  role: Role.USER,
  email: 'test@gmail.com',
  username: 'testUser',
};

export const mockUser: User = {
  ...mockCreateUserDto,
  ...mockUserDto,
  id: '1',
  ...datesMixin,
};

export const mockCreateOrderDto: CreateOrderDto = {
  items: [{ itemId: '1', quantity: 4 }],
};
export const mockOrderDto: OrderDto = {
  id: '1',
  createdAt: new Date(),
  totalPrice: new Decimal(1500.0),
};

export const mockOrder: Order = {
  ...mockOrderDto,
  ...datesMixin,
  userId: mockUser.id,
};

export const mockCreateFoodDto: CreateFoodDto = {
  name: 'Rice',
  description: 'Grain food',
  price: 500.0,
};
export const mockFoodDto: FoodDto = {
  ...mockCreateFoodDto,
  price: new Decimal(500.0),
  id: '1',
};

export const mockFood: Food = {
  ...mockCreateFoodDto,
  ...mockFoodDto,
  ...datesMixin,
};
