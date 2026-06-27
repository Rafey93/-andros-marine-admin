'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import type { Course } from '@/types';

const inputCls = 'h-9 px-3 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal w-full';

const CATEGORIES = ['Safety', 'Medical', 'Navigation', 'Communication', 'Tanker Ops', 'Security'];
const COLORS = ['#36c6d3', '#F44336', '#8BC34A', '#FFCA28', '#212a7a', '#9C27B0', '#FF9800', '#607D8B'];

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

export default function CoursesClient({ courses: initialCourses }: { courses: Course[] }) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title') as string,
      category: fd.get('category') as string,
      duration: fd.get('duration') as string,
      status: fd.get('status') as Course['status'],
      color: fd.get('color') as string,
      enrolledCount: 0,
      completionRate: 0,
    };
    try {
      const res = await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to add course'); }
      const created: Course = await res.json();
      setCourses(prev => [...prev, created]);
      setAddOpen(false);
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
          <h1 className="text-xl font-bold text-gray-800">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{courses.length} courses in catalog</p>
        </div>
        <button
          onClick={() => { setAddOpen(true); setError(''); }}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
          + Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white overflow-hidden">
            <div className="h-2" style={{ backgroundColor: course.color }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600">
                  {course.category}
                </span>
                <span className={cn(
                  'text-xs font-semibold uppercase tracking-wider px-2 py-0.5',
                  course.status === 'Active' ? 'bg-mas-success/10 text-green-700' : 'bg-gray-100 text-gray-400'
                )}>
                  {course.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-sm leading-snug mb-3">{course.title}</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Duration</p>
                  <p className="text-sm font-semibold text-gray-700">{course.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Enrolled</p>
                  <p className="text-sm font-semibold text-gray-700">{course.enrolledCount} students</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Completion</p>
                  <p className="text-xs font-bold text-gray-600">{course.completionRate}%</p>
                </div>
                <div className="h-1.5 bg-gray-100">
                  <div className="h-full transition-all" style={{ width: `${course.completionRate}%`, backgroundColor: course.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {addOpen && (
        <Modal title="Add New Course" onClose={() => setAddOpen(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FieldRow label="Course Title">
                  <input name="title" required className={inputCls} placeholder="Advanced Fire Safety" />
                </FieldRow>
              </div>
              <FieldRow label="Category">
                <select name="category" required className={inputCls}>
                  <option value="">Select…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Duration">
                <input name="duration" required className={inputCls} placeholder="40 hours" />
              </FieldRow>
              <FieldRow label="Status">
                <select name="status" required className={inputCls} defaultValue="Active">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FieldRow>
              <FieldRow label="Color">
                <select name="color" required className={inputCls} defaultValue="#36c6d3">
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FieldRow>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-60">
                {saving ? 'Adding…' : 'Add Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
