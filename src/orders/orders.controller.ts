import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';
import { OrderDetailDto, OrderDto } from './dto/order.dto';

@ApiBearerAuth()
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiCreatedResponse({ type: OrderDetailDto })
  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto,
    @RequestUser() user: CurrentUserDto,
  ): Promise<OrderDetailDto> {
    return this.ordersService.create(createOrderDto, user);
  }

  @ApiOkResponse({ type: [OrderDto] })
  @Get()
  findAll(@RequestUser() user: CurrentUserDto): Promise<OrderDto[]> {
    return this.ordersService.findAll(user);
  }

  @ApiOkResponse({ type: OrderDetailDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @RequestUser() user: CurrentUserDto,
  ): Promise<OrderDetailDto> {
    return this.ordersService.findOne(id, user);
  }
}
