import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  change?: string;
  changeType?: 'up' | 'down';
}

export default function StatCard({ title, value, icon: Icon, iconBg, iconColor, borderColor, change, changeType }: StatCardProps) {
  return (
    <div className={cn('bg-white border-l-4 p-5 flex items-center gap-4', borderColor)}>
      <div className={cn('w-12 h-12 flex items-center justify-center flex-shrink-0', iconBg)}>
        <Icon className={cn('w-6 h-6', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {change && (
          <p className={cn('text-xs mt-1 flex items-center gap-1', changeType === 'up' ? 'text-mas-success' : 'text-mas-danger')}>
            {changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
