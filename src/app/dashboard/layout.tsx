import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  if (!cookieStore.get('mas_admin_auth')) {
    redirect('/');
  }
  return <DashboardShell>{children}</DashboardShell>;
}
