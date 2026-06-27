'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Certificate } from '@/types';

const statusStyles: Record<string, string> = {
  Valid: 'bg-mas-success/10 text-green-700',
  Expired: 'bg-red-50 text-red-600',
  Revoked: 'bg-gray-100 text-gray-500',
};

const inputCls = 'h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal w-full';

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function downloadCertificate(cert: Certificate) {
  const content = `
MAS MARINE ADMIN — CERTIFICATE OF COMPLETION
=============================================
Certificate No: ${cert.certificateNo}
Student Name:   ${cert.studentName}
Course:         ${cert.courseName}
Issue Date:     ${cert.issueDate}
Expiry Date:    ${cert.expiryDate}
Status:         ${cert.status}
=============================================
  `.trim();
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${cert.certificateNo}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CertificatesClient({ certificates: initialCerts }: { certificates: Certificate[] }) {
  const router = useRouter();
  const [certificates, setCertificates] = useState(initialCerts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [issueOpen, setIssueOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = certificates.filter(c => {
    const matchSearch = c.studentName.toLowerCase().includes(search.toLowerCase()) ||
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      studentName: fd.get('studentName') as string,
      courseName: fd.get('courseName') as string,
      issueDate: fd.get('issueDate') as string,
      expiryDate: fd.get('expiryDate') as string,
      certificateNo: fd.get('certificateNo') as string,
      status: 'Valid' as const,
    };
    try {
      const res = await fetch('/api/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to issue certificate'); }
      const created: Certificate = await res.json();
      setCertificates(prev => [created, ...prev]);
      setIssueOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Certificates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {certificates.length} certificates</p>
        </div>
        <button
          onClick={() => { setIssueOpen(true); setError(''); }}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
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
                  <button
                    onClick={() => downloadCertificate(c)}
                    className="text-gray-400 hover:text-navy transition-colors"
                    title="Download certificate"
                  >
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

      {/* Issue Certificate Modal */}
      {issueOpen && (
        <Modal title="Issue Certificate" onClose={() => setIssueOpen(false)}>
          <form onSubmit={handleIssue} className="space-y-4">
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Student Name">
                <input name="studentName" required className={inputCls} placeholder="Ahmed Al-Rashidi" />
              </FieldRow>
              <FieldRow label="Course Name">
                <input name="courseName" required className={inputCls} placeholder="STCW Basic Safety Training" />
              </FieldRow>
              <FieldRow label="Certificate No.">
                <input name="certificateNo" required className={inputCls} placeholder="MAS-2025-005" />
              </FieldRow>
              <FieldRow label="Issue Date">
                <input name="issueDate" type="date" required className={inputCls} defaultValue={new Date().toISOString().slice(0, 10)} />
              </FieldRow>
              <FieldRow label="Expiry Date">
                <input name="expiryDate" type="date" required className={inputCls} />
              </FieldRow>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIssueOpen(false)} className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-60">
                {saving ? 'Issuing…' : 'Issue Certificate'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
