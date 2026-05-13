import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';
import { SESSION_COOKIE } from '@/lib/session';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_COOKIE)) {
    redirect('/');
  }
  return <DashboardShell>{children}</DashboardShell>;
}
