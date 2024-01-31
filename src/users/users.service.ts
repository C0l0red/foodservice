import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { hashString } from '../common/functions';
import { CurrentUserDto } from '../common/dto/current-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Pick<User, 'username' | 'email' | 'role'>> {
    const passwordHash = await hashString(createUserDto.password);

    return this.prisma.user.create({
      data: {
        username: createUserDto.username.toLowerCase(),
        email: createUserDto.email.toLowerCase(),
        password: passwordHash,
        role: createUserDto.role,
      },
      select: { username: true, email: true, role: true },
    });
  }

  getProfile(
    user: CurrentUserDto,
  ): Promise<Pick<User, 'username' | 'email' | 'role'>> {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { username: true, email: true, orders: true, role: true },
    });
  }

  async findByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<Partial<User>> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
      select: { id: true, username: true, password: true, role: true },
    });
  }

  async verifyPassword(user: User | Partial<User>, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
