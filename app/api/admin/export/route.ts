import { requireRole } from '@/lib/guards';
import { prisma } from '@/lib/db';

export async function GET() {
  const guard = await requireRole('ADMIN');
  if (guard.error) return guard.error;

  const logs = await prisma.habitLog.findMany({ include: { user: true, habit: true }, orderBy: { date: 'desc' } });
  const csv = ['User,Habit,Date,Status', ...logs.map((l) => `${l.user.email},${l.habit.title},${l.date.toISOString()},${l.status}`)].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="habit-report.csv"'
    }
  });
}
