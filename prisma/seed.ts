import { PrismaClient, Role } from '@prisma/client';
import { hashString } from '../src/common/functions';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@gmail.com',
      password: await hashString('password'),
      role: Role.ADMIN,
    },
  });
  await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      email: 'user@gmail.com',
      password: await hashString('password'),
      role: Role.USER,
    },
  });

  await prisma.food.upsert({
    where: { name: 'Pasta' },
    update: {},
    create: {
      name: 'Pasta',
      description: 'Spaghetti made with love',
      price: 500.0,
    },
  });
  await prisma.food.upsert({
    where: { name: 'Jollof' },
    update: {},
    create: {
      name: 'Jollof',
      description: 'Nigerian rice recipe',
      price: 250.0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
