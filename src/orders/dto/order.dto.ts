import { ItemDto } from './item.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  totalPrice: Decimal;

  @ApiProperty()
  createdAt: Date;
}

export class OrderDetailDto extends OrderDto {
  @ApiProperty({ type: [ItemDto] })
  items?: ItemDto[];
}
