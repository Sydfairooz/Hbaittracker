import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/log';
import { NextResponse } from 'next/server';
import { startOfDay } from '@/lib/date';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { habitId, status } = await req.json();
  const date = startOfDay(new Date());

  const habitLog = await prisma.habitLog.upsert({
    where: { userId_habitId_date: { userId: session.user.id, habitId, date } },
    update: { status },
    create: { userId: session.user.id, habitId, status, date }
  });

  await logActivity(session.user.id, 'USER_MARKED_HABIT', { habitId, status, date });

  return NextResponse.json({ habitLog });
}
