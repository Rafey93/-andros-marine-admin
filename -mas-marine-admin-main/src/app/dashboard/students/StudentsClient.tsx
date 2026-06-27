'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Student } from '@/types';

const statusColors: Record<string, string> = {
  Active: 'bg-teal/10 text-teal-dark',
  Completed: 'bg-mas-success/10 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

const riskColor = (score: number) =>
  score >= 76 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-500';

const RANKS = ['Captain', 'Chief Officer', 'Second Officer', 'Third Officer', 'Chief Engineer', 'Second Engineer', 'Third Engineer', 'Deck Cadet', 'Engine Cadet', 'Bosun', 'AB Seaman', 'OS'];

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
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

const inputCls = 'h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal w-full';

export default function StudentsClient({ students: initialStudents }: { students: Student[] }) {
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      rank: fd.get('rank') as string,
      course: fd.get('course') as string,
      enrollmentDate: fd.get('enrollmentDate') as string,
      status: 'Active' as const,
      progress: 0,
      riskScore: 0,
    };
    try {
      const res = await fetch('/api/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to enroll'); }
      const created: Student = await res.json();
      setStudents(prev => [created, ...prev]);
      setEnrollOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStudent) return;
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      rank: fd.get('rank') as string,
      course: fd.get('course') as string,
      enrollmentDate: fd.get('enrollmentDate') as string,
      status: fd.get('status') as Student['status'],
      progress: Number(fd.get('progress')),
      riskScore: Number(fd.get('riskScore')),
    };
    try {
      const res = await fetch(`/api/students/${editStudent.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to update'); }
      const updated: Student = await res.json();
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
      setEditStudent(null);
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
          <h1 className="text-xl font-bold text-gray-800">Students & Trainees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {students.length} trainees</p>
        </div>
        <button
          onClick={() => { setEnrollOpen(true); setError(''); }}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
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
                    <button onClick={() => setViewStudent(s)} className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors">View</button>
                    <button onClick={() => { setEditStudent(s); setError(''); }} className="text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors">Edit</button>
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

      {/* Enroll Modal */}
      {enrollOpen && (
        <Modal title="Enroll New Student" onClose={() => setEnrollOpen(false)}>
          <form onSubmit={handleEnroll} className="space-y-4">
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Full Name">
                <input name="name" required className={inputCls} placeholder="Ahmed Al-Rashidi" />
              </FieldRow>
              <FieldRow label="Email">
                <input name="email" type="email" required className={inputCls} placeholder="a.rashidi@masfleet.com" />
              </FieldRow>
              <FieldRow label="Rank">
                <select name="rank" required className={inputCls}>
                  <option value="">Select rank…</option>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Course">
                <input name="course" required className={inputCls} placeholder="STCW Basic Safety Training" />
              </FieldRow>
              <FieldRow label="Enrollment Date">
                <input name="enrollmentDate" type="date" required className={inputCls} defaultValue={new Date().toISOString().slice(0, 10)} />
              </FieldRow>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEnrollOpen(false)} className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-60">
                {saving ? 'Enrolling…' : 'Enroll Student'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewStudent && (
        <Modal title="Student Profile" onClose={() => setViewStudent(null)}>
          <div className="space-y-3">
            {[
              ['Name', viewStudent.name],
              ['Email', viewStudent.email],
              ['Rank', viewStudent.rank],
              ['Course', viewStudent.course],
              ['Enrolled', viewStudent.enrollmentDate],
              ['Status', viewStudent.status],
              ['Progress', `${viewStudent.progress}%`],
              ['Risk Score', `${viewStudent.riskScore} / 100`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-50 text-sm">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-gray-800 font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={() => { setViewStudent(null); setEditStudent(viewStudent); }} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark">Edit Student</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editStudent && (
        <Modal title="Edit Student" onClose={() => setEditStudent(null)}>
          <form onSubmit={handleEdit} className="space-y-4">
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Full Name">
                <input name="name" required className={inputCls} defaultValue={editStudent.name} />
              </FieldRow>
              <FieldRow label="Email">
                <input name="email" type="email" required className={inputCls} defaultValue={editStudent.email} />
              </FieldRow>
              <FieldRow label="Rank">
                <select name="rank" required className={inputCls} defaultValue={editStudent.rank}>
                  {RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Course">
                <input name="course" required className={inputCls} defaultValue={editStudent.course} />
              </FieldRow>
              <FieldRow label="Enrollment Date">
                <input name="enrollmentDate" type="date" required className={inputCls} defaultValue={editStudent.enrollmentDate} />
              </FieldRow>
              <FieldRow label="Status">
                <select name="status" required className={inputCls} defaultValue={editStudent.status}>
                  {['Active', 'Inactive', 'Completed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Progress (%)">
                <input name="progress" type="number" min="0" max="100" required className={inputCls} defaultValue={editStudent.progress} />
              </FieldRow>
              <FieldRow label="Risk Score (0–100)">
                <input name="riskScore" type="number" min="0" max="100" required className={inputCls} defaultValue={editStudent.riskScore} />
              </FieldRow>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditStudent(null)} className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
