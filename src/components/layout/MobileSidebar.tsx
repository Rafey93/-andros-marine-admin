'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Anchor, LogOut } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { navItems } from '@/lib/navItems';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[240px] bg-navy border-0">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-teal flex items-center justify-center flex-shrink-0">
            <Anchor className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight uppercase tracking-wide">MAS Marine</p>
            <p className="text-white/50 text-xs">Academy Admin</p>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const isActive = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-teal text-white font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-xs w-full transition-colors py-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
