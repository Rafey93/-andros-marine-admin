'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Campaign } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, Users, X } from 'lucide-react';

const statusStyles: Record<string, string> = {
  Active:    'bg-teal/10 text-teal-dark',
  Completed: 'bg-mas-success/10 text-green-700',
  Scheduled: 'bg-navy/10 text-navy',
  Overdue:   'bg-red-50 text-red-600',
};

const progressColor: Record<string, string> = {
  Active:    '#36c6d3',
  Completed: '#8BC34A',
  Scheduled: '#212a7a',
  Overdue:   '#F44336',
};

const GROUPS = ['Deck Officers', 'Engine Room Crew', 'Cadets', 'Ratings', 'Tanker Fleet', 'All Crew'];
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

export default function CampaignsClient({ campaigns: initialCampaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [filter, setFilter] = useState('All');
  const [newOpen, setNewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filtered = campaigns.filter(c => filter === 'All' || c.status === filter);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title') as string,
      assignedGroup: fd.get('assignedGroup') as string,
      deadline: fd.get('deadline') as string,
      description: fd.get('description') as string,
      status: 'Scheduled' as const,
      totalAssigned: Number(fd.get('totalAssigned')) || 0,
    };
    try {
      const res = await fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create campaign'); }
      const created = await res.json();
      setCampaigns(prev => [...prev, { ...created, courses: [] }]);
      setNewOpen(false);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Training Campaigns</h1>
          <p className="text-sm text-gray-500 mt-0.5">KnowBe4-style campaign management for maritime crews</p>
        </div>
        <button
          onClick={() => { setNewOpen(true); setError(''); }}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold uppercase tracking-wider hover:bg-navy-dark transition-colors"
        >
          + New Campaign
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Campaigns', value: campaigns.length, color: 'border-navy' },
          { label: 'Active',          value: campaigns.filter(c => c.status === 'Active').length,    color: 'border-teal' },
          { label: 'Overdue',         value: campaigns.filter(c => c.status === 'Overdue').length,   color: 'border-mas-danger' },
          { label: 'Completed',       value: campaigns.filter(c => c.status === 'Completed').length, color: 'border-mas-success' },
        ].map(s => (
          <div key={s.label} className={cn('bg-white border-l-4 px-4 py-3', s.color)}>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5">
        {['All', 'Active', 'Completed', 'Scheduled', 'Overdue'].map(f => (
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

      {/* Campaign cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((campaign) => {
          const pct = campaign.completionRate;
          const color = progressColor[campaign.status] ?? '#999';
          const r = 26, circ = 2 * Math.PI * r;
          const stroke = circ - (pct / 100) * circ;
          return (
            <div key={campaign.id} className="bg-white p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-sm leading-snug">{campaign.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{campaign.description}</p>
                </div>
                <div className="relative flex-shrink-0 w-16 h-16">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r={r} fill="none" stroke="#f0f0f0" strokeWidth="6" />
                    <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
                      strokeDasharray={`${circ}`} strokeDashoffset={stroke} strokeLinecap="butt" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{pct}%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{campaign.assignedGroup}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due {campaign.deadline}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{campaign.completed} / {campaign.totalAssigned} completed</span>
                  <span className={cn('font-semibold px-1.5 py-0.5 uppercase tracking-wide text-xs', statusStyles[campaign.status])}>
                    {campaign.status}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100">
                  <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400 text-sm bg-white">No campaigns found.</div>
        )}
      </div>

      {/* New Campaign Modal */}
      {newOpen && (
        <Modal title="New Training Campaign" onClose={() => setNewOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2">{error}</p>}
            <div className="grid grid-cols-2 gap-4">
              <FieldRow label="Campaign Title">
                <input name="title" required className={cn(inputCls, 'col-span-2')} placeholder="Q3 Safety Refresher" />
              </FieldRow>
              <FieldRow label="Assigned Group">
                <select name="assignedGroup" required className={inputCls}>
                  <option value="">Select group…</option>
                  {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Deadline">
                <input name="deadline" type="date" required className={inputCls} />
              </FieldRow>
              <FieldRow label="Total Assigned">
                <input name="totalAssigned" type="number" min="0" className={inputCls} defaultValue="0" />
              </FieldRow>
            </div>
            <FieldRow label="Description">
              <textarea name="description" rows={3} className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal w-full resize-none" placeholder="Brief description of this campaign…" />
            </FieldRow>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewOpen(false)} className="px-4 py-2 border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-navy text-white text-sm font-semibold hover:bg-navy-dark disabled:opacity-60">
                {saving ? 'Creating…' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
