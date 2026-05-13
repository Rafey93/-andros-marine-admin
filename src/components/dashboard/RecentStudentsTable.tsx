import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Student } from '@/types';

const statusColors: Record<string, string> = {
  Active:    'bg-teal/10 text-teal-dark',
  Completed: 'bg-mas-success/10 text-green-700',
  Inactive:  'bg-gray-100 text-gray-500',
};

export default function RecentStudentsTable({ students }: { students: Student[] }) {
  const recent = [...students].slice(0, 5);
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Students</h2>
        <Link href="/dashboard/students" className="text-xs text-teal hover:text-teal-dark font-semibold uppercase tracking-wider transition-colors">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Student</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Course</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Progress</th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.rank}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600 hidden sm:table-cell text-xs">{s.course}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 max-w-[80px]">
                      <div
                        className="h-full bg-teal transition-all"
                        style={{ width: `${s.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={cn('px-2 py-0.5 text-xs font-semibold uppercase tracking-wide', statusColors[s.status])}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
