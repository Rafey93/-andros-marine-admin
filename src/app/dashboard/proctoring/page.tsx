'use client';

import { useState, useEffect } from 'react';
import { mockExamSessions } from '@/lib/mock-data';
import SessionReviewCard from '@/components/proctoring/SessionReviewCard';
import type { ExamSession, Snapshot } from '@/types';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

export default function ProctoringPage() {
  const [sessions, setSessions] = useState<ExamSession[]>(mockExamSessions);
  const [snapshotMap, setSnapshotMap] = useState<Record<string, Snapshot[]>>({});
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // Merge any real sessions from localStorage with mock data
    try {
      const stored = JSON.parse(localStorage.getItem('mas_exam_sessions') || '[]') as ExamSession[];
      if (stored.length > 0) {
        setSessions([...stored, ...mockExamSessions]);
      }
      // Load snapshots for each stored session
      const map: Record<string, Snapshot[]> = {};
      stored.forEach(s => {
        try {
          const snaps = JSON.parse(localStorage.getItem(`mas_snapshots_${s.id}`) || '[]') as Snapshot[];
          map[s.id] = snaps;
        } catch {}
      });
      setSnapshotMap(map);
    } catch {}
  }, []);

  const filtered = sessions.filter(s => {
    if (filter === 'Flagged') return s.flagCount > 0 || s.status === 'Flagged';
    if (filter === 'Clean')   return s.flagCount === 0 && s.status !== 'Flagged';
    return true;
  });

  const flaggedCount = sessions.filter(s => s.flagCount > 0 || s.status === 'Flagged').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Exam Proctoring Review</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review webcam captures and flags from certification exams</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border-l-4 border-navy px-4 py-3">
          <p className="text-2xl font-bold text-gray-800">{sessions.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Sessions</p>
        </div>
        <div className="bg-white border-l-4 border-red-500 px-4 py-3">
          <p className="text-2xl font-bold text-red-500">{flaggedCount}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Flagged</p>
        </div>
        <div className="bg-white border-l-4 border-mas-success px-4 py-3">
          <p className="text-2xl font-bold text-green-600">{sessions.length - flaggedCount}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Clean</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {['All', 'Flagged', 'Clean'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
              filter === f ? 'bg-navy text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Session list */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center">
          <Video className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No sessions found.</p>
          <p className="text-gray-300 text-xs mt-1">Complete an exam at /dashboard/exam/1 to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(session => (
            <SessionReviewCard
              key={session.id}
              session={session}
              snapshots={snapshotMap[session.id] ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
