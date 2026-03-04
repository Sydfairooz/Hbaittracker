import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'ADMIN',
      passwordHash: adminPass
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@company.com' },
    update: {},
    create: {
      name: 'Staff User',
      email: 'user@company.com',
      role: 'USER',
      passwordHash: await hash('user123', 10)
    }
  });
}

main().finally(async () => prisma.$disconnect());
