import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import { Order } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createOrderDto: CreateOrderDto,
    user: CurrentUserDto,
  ): Promise<Pick<Order, 'id' | 'totalPrice' | 'createdAt'>> {
    let totalPrice = new Decimal(0);

    const items: Record<string, number> = createOrderDto.items.reduce(
      (accumulator, currentItem) => {
        accumulator[currentItem.itemId] = currentItem.quantity;
        return accumulator;
      },
      {},
    );
    const foods = await this.prisma.food.findMany({
      where: { id: { in: Object.keys(items) } },
    });

    foods.forEach((food) => {
      const itemQuantity = items[food.id];
      totalPrice = totalPrice.add(food.price.mul(itemQuantity));
    });

    return this.prisma.order.create({
      data: {
        user: { connect: user },
        items: { create: createOrderDto.items },
        totalPrice: totalPrice,
      },
      select: {
        id: true,
        items: { select: { itemId: true, quantity: true } },
        totalPrice: true,
        createdAt: true,
      },
    });
  }

  findAll(
    user: CurrentUserDto,
  ): Promise<Pick<Order, 'id' | 'totalPrice' | 'createdAt'>[]> {
    return this.prisma.order.findMany({
      where: { user: { id: user.id } },
      select: {
        id: true,
        totalPrice: true,
        createdAt: true,
      },
    });
  }

  findOne(
    id: string,
    user: CurrentUserDto,
  ): Promise<Pick<Order, 'id' | 'totalPrice' | 'createdAt'>> {
    return this.prisma.order.findUniqueOrThrow({
      where: { user: { id: user.id }, id },
      select: {
        id: true,
        items: { select: { itemId: true, quantity: true } },
        totalPrice: true,
        createdAt: true,
      },
    });
  }
}
