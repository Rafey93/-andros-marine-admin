'use client';

import { useSidebar } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import TopNavbar from './TopNavbar';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
      <MobileSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar onMenuClick={sidebar.toggle} />
        <main className="flex-1 overflow-y-auto bg-page p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
