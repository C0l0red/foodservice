import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { CurrentUserDto } from '../../common/dto/current-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, password: string) {
    const user = await this.usersService.findByEmailOrUsername(
      emailOrUsername,
      emailOrUsername,
    );
    if (user && (await this.usersService.verifyPassword(user, password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(user: CurrentUserDto) {
    const payload: JwtPayloadDto = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
