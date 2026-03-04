import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ users });
}
