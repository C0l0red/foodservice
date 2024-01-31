import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FoodDto } from './dto/food.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('foods')
@Roles(Role.ADMIN)
@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @ApiBody({ type: CreateFoodDto, description: 'Add a food to the service' })
  @ApiCreatedResponse({ type: FoodDto })
  @Post()
  create(@Body() createFoodDto: CreateFoodDto) {
    return this.foodsService.create(createFoodDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: [FoodDto] })
  @Get()
  findAll(): Promise<FoodDto[]> {
    return this.foodsService.findAll();
  }

  @Roles(Role.ADMIN, Role.USER)
  @ApiOkResponse({ type: FoodDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodsService.findOne(id);
  }

  @ApiOkResponse({ type: FoodDto })
  @Patch(':id')
  async update(@Body() updateFoodDto: UpdateFoodDto, @Param('id') id: string) {
    return this.foodsService.update(updateFoodDto, id);
  }

  @ApiAcceptedResponse()
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.foodsService.remove(id);
  }
}
