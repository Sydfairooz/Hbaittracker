import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { logActivity } from '@/lib/log';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const body = await req.json();
  const { title, description, month, year, userIds, assignAll } = body;

  const habit = await prisma.habit.create({
    data: { title, description, month, year, createdById: guard.session!.user.id }
  });

  const users = assignAll
    ? await prisma.user.findMany({ where: { role: 'USER' }, select: { id: true } })
    : (userIds || []).map((id: string) => ({ id }));

  if (users.length) {
    await prisma.habitAssignment.createMany({
      data: users.map((u: { id: string }) => ({ userId: u.id, habitId: habit.id }))
    });
  }

  await logActivity(guard.session!.user.id, 'ADMIN_CREATED_HABIT', { title, userCount: users.length });
  return NextResponse.json({ habit });
}

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const habits = await prisma.habit.findMany({ include: { assignments: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ habits });
}
