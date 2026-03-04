import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { startOfDay } from '@/lib/date';

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const today = startOfDay(new Date());

  const pendingHabits = await prisma.habitAssignment.count({
    where: {
      userId: session.user.id,
      active: true,
      habit: {
        habitLogs: {
          none: {
            userId: session.user.id,
            date: today
          }
        }
      }
    }
  });

  if (pendingHabits > 0) {
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'HABIT_PENDING',
        title: 'Habit update pending',
        message: `You have ${pendingHabits} habits not marked for today.`
      }
    });
  }

  const pendingAttendance = await prisma.attendance.count({
    where: {
      userId: session.user.id,
      status: 'PENDING',
      requiredDate: { date: { lte: new Date() } }
    }
  });

  if (pendingAttendance > 0) {
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'ATTENDANCE_PENDING',
        title: 'Attendance pending',
        message: `You have ${pendingAttendance} required attendance records pending.`
      }
    });
  }

  return NextResponse.json({ pendingHabits, pendingAttendance });
}
