import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { UserDashboard } from '@/components/user-dashboard';

export default async function UserPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  if (session.user.role !== 'USER') redirect('/admin');
  return <UserDashboard />;
}
