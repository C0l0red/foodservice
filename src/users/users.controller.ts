import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { UserDto } from './dto/user.dto';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { CurrentUserDto } from '../common/dto/current-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @ApiBody({ type: CreateUserDto, description: 'Register a User' })
  @ApiCreatedResponse({ type: UserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiOkResponse({ type: UserDto })
  @Get('profile')
  getProfile(@RequestUser() user: CurrentUserDto) {
    return this.usersService.getProfile(user);
  }
}
