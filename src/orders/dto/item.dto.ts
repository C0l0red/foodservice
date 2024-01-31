import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class ItemDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
