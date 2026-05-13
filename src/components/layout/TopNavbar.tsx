'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logout } from '@/lib/auth';

interface Props {
  onMenuClick: () => void;
}

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return 'Dashboard';
  return segments.slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ')).join(' / ');
}

export default function TopNavbar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1">
        <span className="text-sm font-semibold text-gray-700">
          {getBreadcrumb(pathname)}
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-mas-danger rounded-full" />
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center text-white text-xs font-bold">
                MA
              </div>
              <span className="hidden sm:block font-medium">Maya Admin</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <User className="w-4 h-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-sm text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
