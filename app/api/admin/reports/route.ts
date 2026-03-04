import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || undefined;

  const [habitSummary, attendanceSummary, timeline] = await Promise.all([
    prisma.habitLog.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    }),
    prisma.attendance.groupBy({
      by: ['status'],
      where: { userId },
      _count: true
    }),
    prisma.activityLog.findMany({
      where: userId ? { userId } : {},
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 150
    })
  ]);

  return NextResponse.json({ habitSummary, attendanceSummary, timeline });
}
