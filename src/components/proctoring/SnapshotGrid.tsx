'use client';

import type { Snapshot } from '@/types';

interface SnapshotGridProps {
  snapshots: Snapshot[];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SnapshotGrid({ snapshots }: SnapshotGridProps) {
  if (snapshots.length === 0) {
    return <p className="text-xs text-gray-400 py-2">No snapshots captured.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
      {snapshots.map((snap, i) => (
        <div key={i} className="relative overflow-hidden bg-gray-100 aspect-video">
          <img
            src={snap.dataUrl}
            alt={`Snapshot ${i + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1.5 py-0.5">
            {formatTime(snap.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}
