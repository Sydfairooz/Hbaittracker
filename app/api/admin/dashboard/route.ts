import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;

  const [habitDone, habitMissed, present, absent] = await Promise.all([
    prisma.habitLog.count({ where: { status: 'TICK' } }),
    prisma.habitLog.count({ where: { status: 'CROSS' } }),
    prisma.attendance.count({ where: { status: 'PRESENT' } }),
    prisma.attendance.count({ where: { status: 'ABSENT' } })
  ]);

  return NextResponse.json({
    summary: {
      habitsDone: habitDone,
      habitsMissed: habitMissed,
      attendancePresent: present,
      attendanceAbsent: absent
    }
  });
}
