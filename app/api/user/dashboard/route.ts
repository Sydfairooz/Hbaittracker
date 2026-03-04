import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfDay } from '@/lib/date';

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const today = startOfDay(new Date());

  const assignments = await prisma.habitAssignment.findMany({
    where: { userId: session.user.id, active: true },
    include: { habit: true }
  });

  const habits = await Promise.all(
    assignments.map(async (a) => {
      const log = await prisma.habitLog.findUnique({
        where: { userId_habitId_date: { userId: session.user.id, habitId: a.habitId, date: today } }
      });
      return { id: a.habitId, title: a.habit.title, status: log?.status ?? 'PENDING' };
    })
  );

  const attendanceRows = await prisma.attendance.findMany({
    where: { userId: session.user.id },
    include: { requiredDate: true },
    orderBy: { requiredDate: { date: 'asc' } }
  });

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20
  });

  return NextResponse.json({
    habits,
    attendance: attendanceRows.map((a) => ({
      id: a.requiredDateId,
      title: a.requiredDate.title,
      date: a.requiredDate.date,
      status: a.status
    })),
    notifications
  });
}
