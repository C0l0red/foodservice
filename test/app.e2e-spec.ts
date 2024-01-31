import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { PrismaClient, Role, User } from '@prisma/client';
import { LoginRequestDto } from '../src/auth/dto/login.request.dto';
import { CreateOrderDto } from '../src/orders/dto/create-order.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let startTime: Date;
  let adminToken: string;
  let userToken: string;
  let prisma: PrismaClient;

  const randomUUID = 'e65ee581-1f0c-448e-8a2a-2447de698af4';
  const adminUser: Partial<User> = {
    email: 'admin@gmail.com',
    username: 'admin',
    password: 'password',
  };
  const regularUser: Partial<User> = {
    email: 'user@gmail.com',
    username: 'user',
    password: 'password',
  };

  const adminLoginRequest: LoginRequestDto = {
    username: adminUser.username,
    password: adminUser.password,
  };
  const userLoginRequest: LoginRequestDto = {
    username: regularUser.username,
    password: regularUser.password,
  };

  beforeAll(() => {
    prisma = new PrismaClient();
    startTime = new Date();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    if (!adminToken) {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminLoginRequest);
      adminToken = response.body.token;
    }
    if (!userToken) {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userLoginRequest);
      userToken = response.body.token;
    }
  });

  const makeRequest = (
    method: string,
    route: string,
    body: any,
    expectedStatus: number,
    token: string = null,
  ) => {
    return request(app.getHttpServer())
      [method](route)
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(expectedStatus);
  };

  describe('Users Resource', () => {
    describe('POST /users', () => {
      const createUserDto: CreateUserDto = {
        username: 'test',
        email: 'test@gmail.com',
        role: Role.USER,
        password: 'password',
      };
      it('should create a user', () => {
        return makeRequest('post', '/users', createUserDto, 201).expect(
          ({ body }) => {
            expect(body.username).toEqual(createUserDto.username);
            expect(body.email).toEqual(createUserDto.email);
          },
        );
      });

      it('should not allow duplicate emails or usernames', () => {
        return makeRequest('post', '/users', createUserDto, 409);
      });
    });

    describe('GET /users/profile', () => {
      it('should not allow an unauthenticated request', () => {
        return makeRequest('get', '/users/profile', null, 401);
      });

      it("should return the current user's profile", () => {
        return makeRequest(
          'get',
          '/users/profile',
          null,
          200,
          adminToken,
        ).expect(({ body }) => {
          expect(body.email).toEqual(adminUser.email);
          expect(body.username).toEqual(adminUser.username);
        });
      });
    });
  });

  describe('Food Resource', () => {
    const createFoodDto = {
      name: 'Akara',
      description: 'Bean cake',
      price: 49.99,
    };
    describe('POST /foods', () => {
      it('should add a new food', () => {
        return makeRequest(
          'post',
          '/foods',
          createFoodDto,
          201,
          adminToken,
        ).expect(({ body }) => {
          expect(body.name).toEqual(createFoodDto.name);
          expect(body.description).toEqual(createFoodDto.description);
          expect(Number(body.price)).toEqual(createFoodDto.price);
        });
      });

      it('should not allow duplicate names', () => {
        return makeRequest('post', '/foods', createFoodDto, 409, adminToken);
      });

      it('should not allow regular users', () => {
        return makeRequest('post', '/foods', createFoodDto, 403, userToken);
      });
    });

    describe('GET /foods', () => {
      it('should return all food', () => {
        return makeRequest('get', '/foods', null, 200, adminToken).expect(
          ({ body }) => {
            expect(body.length).toBeGreaterThanOrEqual(2);
          },
        );
      });
    });

    describe('GET /foods/:id', () => {
      it('should return a food when given a valid ID', async () => {
        const food = await prisma.food.findFirst();

        return makeRequest(
          'get',
          `/foods/${food.id}`,
          null,
          200,
          adminToken,
        ).expect(({ body }) => {
          expect(body.name).toEqual(food.name);
        });
      });

      it('should fail when given an invalid ID', () => {
        return makeRequest(
          'get',
          `/foods/${randomUUID}`,
          null,
          404,
          adminToken,
        );
      });
    });

    describe('PATCH /foods/:id', () => {
      it('should update an existing food', async () => {
        const food = await prisma.food.create({
          data: {
            name: 'Indomie',
            description: 'Instant Noodles',
            price: 59.99,
          },
        });

        return makeRequest(
          'patch',
          `/foods/${food.id}`,
          { name: 'Indomie Noodles' },
          200,
          adminToken,
        ).expect(({ body }) => {
          expect(body.name).toEqual('Indomie Noodles');
        });
      });

      it('should not allow updating to an existing name', async () => {
        const food = await prisma.food.create({
          data: {
            name: 'Fruit Cake',
            description: 'Fresh pastry',
            price: 1000.0,
          },
        });

        return makeRequest(
          'patch',
          `/foods/${food.id}`,
          { name: 'Pasta' },
          409,
          adminToken,
        );
      });

      it('should not allow a regular user', () => {
        return makeRequest('patch', `/foods/${randomUUID}`, {}, 403, userToken);
      });
    });

    describe('DELETE /foods/:id', () => {
      it('should delete an existing food', async () => {
        const food = await prisma.food.create({
          data: {
            name: 'Shawarma',
            description: 'Unleavened bread with meat and sauce',
            price: 2200.0,
          },
        });

        return makeRequest(
          'delete',
          `/foods/${food.id}`,
          null,
          202,
          adminToken,
        );
      });

      it('should fail when given an invalid ID', () => {
        return makeRequest(
          'delete',
          `/foods/${randomUUID}`,
          null,
          404,
          adminToken,
        );
      });

      it('should not allow a regular user', () => {
        return makeRequest(
          'delete',
          `/foods/${randomUUID}`,
          null,
          403,
          userToken,
        );
      });
    });
  });

  describe('Order Resource', () => {
    describe('POST /orders', () => {
      it('should create an order for the current user', async () => {
        const foods = await prisma.food.findMany({ take: 2 });
        const requestBody: CreateOrderDto = {
          items: [
            { itemId: foods[0].id, quantity: 2 },
            { itemId: foods[1].id, quantity: 3 },
          ],
        };
        return makeRequest(
          'post',
          '/orders',
          requestBody,
          201,
          userToken,
        ).expect(({ body }) => {
          expect(Number(body.totalPrice)).toEqual(
            Number(foods[0].price.mul(2).add(foods[1].price.mul(3))),
          );
        });
      });
    });

    describe('GET /orders', () => {
      it('should return all orders for the current user', async () => {
        await prisma.order.create({
          data: {
            user: { connect: { username: adminUser.username } },
            totalPrice: 1000.0,
          },
        });

        return makeRequest('get', '/orders', null, 200, adminToken).expect(
          ({ body }) => {
            expect(body.length).toBeGreaterThanOrEqual(1);
          },
        );
      });

      it('should not allow unauthenticated users', () => {
        return makeRequest('get', '/orders', null, 401, null);
      });
    });

    describe('GET /orders/:id', () => {
      it('should return an existing order when a valid ID is passed', async () => {
        const order = await prisma.order.create({
          data: {
            user: { connect: { username: adminUser.username } },
            totalPrice: 2000.0,
          },
        });

        return makeRequest(
          'get',
          `/orders/${order.id}`,
          null,
          200,
          adminToken,
        ).expect(({ body }) => {
          expect(body.id).toEqual(order.id);
        });
      });

      it("should not allow a user view another user's order", async () => {
        const order = await prisma.order.create({
          data: {
            user: { connect: { username: regularUser.username } },
            totalPrice: 2000.0,
          },
        });

        return makeRequest('get', `/orders/${order.id}`, null, 404, adminToken);
      });
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { createdAt: { gte: startTime } } });
    await prisma.order.deleteMany({ where: { createdAt: { gte: startTime } } });
    await prisma.food.deleteMany({ where: { createdAt: { gte: startTime } } });

    await prisma.$disconnect();
  });
});
