import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { FoodsModule } from './foods/foods.module';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';

@Module({
  imports: [UsersModule, OrdersModule, AuthModule, PrismaModule, FoodsModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
  ],
})
export class AppModule {}
