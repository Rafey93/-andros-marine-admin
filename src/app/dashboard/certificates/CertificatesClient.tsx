'use client';

import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const statusStyles: Record<string, string> = {
  Valid: 'bg-mas-success/10 text-green-700',
  Expired: 'bg-red-50 text-red-600',
  Revoked: 'bg-gray-100 text-gray-500',
};

export default function CertificatesClient({ certificates }: { certificates: Certificate[] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = certificates.filter(c => {
    const matchSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Certificates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {certificates.length} certificates</p>
        </div>
        <button className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors">
          + Issue Certificate
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal"
          />
        </div>
        <div className="flex gap-1.5">
          {['All', 'Valid', 'Expired', 'Revoked'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                filter === s ? 'bg-navy text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
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
              {['Cert No.', 'Student', 'Course', 'Issue Date', 'Expiry Date', 'Status', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-navy font-semibold">{c.certificateNo}</td>
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{c.studentName}</td>
                <td className="px-4 py-3 text-gray-600 text-xs max-w-[200px] truncate">{c.courseName}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.issueDate}</td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{c.expiryDate}</td>
                <td className="px-4 py-3">
                  <span className={cn('px-2 py-0.5 text-xs font-semibold uppercase tracking-wide', statusStyles[c.status])}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-navy transition-colors" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No certificates found.</div>
        )}
      </div>
    </div>
  );
}
