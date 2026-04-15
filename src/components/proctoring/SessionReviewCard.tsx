'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import SnapshotGrid from './SnapshotGrid';
import type { ExamSession, Snapshot } from '@/types';

interface SessionReviewCardProps {
  session: ExamSession;
  snapshots: Snapshot[];
}

function formatDuration(start: number, end?: number) {
  const ms = (end ?? Date.now()) - start;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

export default function SessionReviewCard({ session, snapshots }: SessionReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isFlagged = session.flagCount > 0 || session.status === 'Flagged';

  return (
    <div className={cn('bg-white overflow-hidden', isFlagged ? 'border-l-4 border-red-500' : 'border-l-4 border-mas-success')}>
      <div className="p-4 flex items-center gap-4">
        {/* Status icon */}
        <div className={cn('w-9 h-9 flex items-center justify-center flex-shrink-0', isFlagged ? 'bg-red-50' : 'bg-green-50')}>
          {isFlagged
            ? <AlertTriangle className="w-5 h-5 text-red-500" />
            : <CheckCircle className="w-5 h-5 text-green-600" />}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-gray-800 text-sm">{session.studentName}</p>
            {isFlagged && (
              <span className="text-xs font-semibold px-1.5 py-0.5 bg-red-50 text-red-600 uppercase tracking-wide">
                Flagged
              </span>
            )}
            {session.score !== undefined && (
              <span className={cn('text-xs font-bold px-1.5 py-0.5 uppercase tracking-wide',
                session.score >= 70 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600')}>
                Score: {session.score}%
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{session.examTitle}</p>
          <div className="flex gap-3 mt-1 text-xs text-gray-500">
            <span>{new Date(session.startTime).toLocaleString()}</span>
            <span>Duration: {formatDuration(session.startTime, session.endTime)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 flex-shrink-0 text-xs text-center">
          <div>
            <p className="font-bold text-gray-700">{session.snapshotCount}</p>
            <p className="text-gray-400">Captures</p>
          </div>
          <div>
            <p className={cn('font-bold', isFlagged ? 'text-red-500' : 'text-gray-700')}>{session.flagCount}</p>
            <p className="text-gray-400">Flags</p>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Snapshots
        </button>
      </div>

      {/* Expanded snapshots */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4">
          <SnapshotGrid snapshots={snapshots} />
        </div>
      )}
    </div>
  );
}
