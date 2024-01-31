import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemDto } from './item.dto';

export class CreateOrderDto {
  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ItemDto)
  items: ItemDto[];
}
