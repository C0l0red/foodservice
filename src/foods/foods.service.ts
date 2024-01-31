import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { Food } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFoodDto } from './dto/update-food.dto';
import { throwIfNull } from '../common/functions';

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFoodDto: CreateFoodDto) {
    return this.prisma.food.create({
      data: { ...createFoodDto },
      select: { id: true, name: true, description: true, price: true },
    });
  }

  async findAll(): Promise<
    Pick<Food, 'id' | 'name' | 'description' | 'price'>[]
  > {
    return this.prisma.food.findMany({
      select: { id: true, name: true, description: true, price: true },
    });
  }

  async findOne(
    id: string,
  ): Promise<Pick<Food, 'id' | 'name' | 'description' | 'price'>> {
    return this.prisma.food.findUniqueOrThrow({
      where: { id },
      select: { id: true, name: true, description: true, price: true },
    });
  }

  async update(updateFoodDto: UpdateFoodDto, id: string) {
    return this.prisma.food.update({
      where: { id },
      data: updateFoodDto,
      select: { id: true, name: true, description: true, price: true },
    });
  }

  async remove(id: string) {
    await this.prisma.food.delete({ where: { id: id } }).then(throwIfNull);
  }
}
