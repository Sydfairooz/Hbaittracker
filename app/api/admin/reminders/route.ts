import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;
  const { frequency = 'daily', customCron, enabled = true } = await req.json();

  const users = await prisma.user.findMany({ where: { role: 'USER' }, select: { id: true } });
  await Promise.all(
    users.map((user) =>
      prisma.reminderConfig.upsert({
        where: { userId: user.id },
        update: { frequency, customCron, enabled },
        create: { userId: user.id, frequency, customCron, enabled }
      })
    )
  );

  return NextResponse.json({ ok: true });
}
