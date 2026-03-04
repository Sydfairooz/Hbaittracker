import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/log';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { requiredDateId, status } = await req.json();

  const attendance = await prisma.attendance.upsert({
    where: { userId_requiredDateId: { userId: session.user.id, requiredDateId } },
    update: { status },
    create: { userId: session.user.id, requiredDateId, status }
  });

  await logActivity(session.user.id, 'USER_MARKED_ATTENDANCE', { requiredDateId, status });

  return NextResponse.json({ attendance });
}
