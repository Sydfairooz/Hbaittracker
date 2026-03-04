import { prisma } from '@/lib/db';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const passwordHash = await hash(body.password, 10);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      role: body.role ?? 'USER',
      passwordHash
    }
  });
  return NextResponse.json({ user });
}
