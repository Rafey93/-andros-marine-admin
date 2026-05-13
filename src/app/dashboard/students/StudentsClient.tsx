'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Student } from '@/types';

const statusColors: Record<string, string> = {
  Active: 'bg-teal/10 text-teal-dark',
  Completed: 'bg-mas-success/10 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

const riskColor = (score: number) =>
  score >= 76 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';

export default function StudentsClient({ students }: { students: Student[] }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Students & Trainees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {students.length} trainees</p>
        </div>
        <button className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors">
          + Enroll Student
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Active', 'Inactive', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                statusFilter === s ? 'bg-navy text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {['#', 'Name', 'Rank', 'Course', 'Enrolled', 'Progress', 'Risk Score', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 whitespace-nowrap">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{s.rank}</td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">{s.course}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.enrollmentDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="flex-1 h-1.5 bg-gray-100">
                      <div className="h-full bg-teal" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('font-bold text-sm', riskColor(s.riskScore))}>{s.riskScore}</span>
                  <span className="text-gray-300 text-xs">/100</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 text-xs font-semibold uppercase tracking-wide', statusColors[s.status])}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors">View</button>
                    <button className="text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No students found.</div>
        )}
      </div>
    </div>
  );
}
