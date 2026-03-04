import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const { title, message, userIds } = await req.json();

  const users = userIds?.length
    ? userIds.map((id: string) => ({ id }))
    : await prisma.user.findMany({ where: { role: 'USER' }, select: { id: true } });

  await prisma.notification.createMany({
    data: users.map((u: { id: string }) => ({
      userId: u.id,
      type: 'ADMIN_MESSAGE',
      title,
      message
    }))
  });

  return NextResponse.json({ sent: users.length });
}
