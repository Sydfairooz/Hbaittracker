import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const logs = await prisma.activityLog.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200
  });
  return NextResponse.json({ logs });
}
