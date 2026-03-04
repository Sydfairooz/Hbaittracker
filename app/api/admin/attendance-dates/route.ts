import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/log';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const { date, title, description } = await req.json();

  const requiredDate = await prisma.attendanceRequiredDate.create({
    data: { date: new Date(date), title, description }
  });

  const users = await prisma.user.findMany({ where: { role: 'USER' }, select: { id: true } });
  await prisma.attendance.createMany({
    data: users.map((u) => ({ userId: u.id, requiredDateId: requiredDate.id }))
  });

  await logActivity(guard.session!.user.id, 'ADMIN_CREATED_ATTENDANCE_DATE', { date, title });

  return NextResponse.json({ requiredDate });
}

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const dates = await prisma.attendanceRequiredDate.findMany({ orderBy: { date: 'desc' } });
  return NextResponse.json({ dates });
}
