import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { RequestUser } from '../common/decorators/request-user.decorator';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginRequestDto } from './dto/login.request.dto';
import { Public } from './decorators/public.decorator';
import { LoginResponseDto } from './dto/login.response.dto';
import { CurrentUserDto } from '../common/dto/current-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: LoginRequestDto })
  @ApiCreatedResponse({ type: LoginResponseDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: CurrentUserDto): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }
}
