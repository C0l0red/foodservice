import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(3)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
