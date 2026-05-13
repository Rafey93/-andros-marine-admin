'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartDataPoint } from '@/types';

export default function EnrollmentChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Enrollment Trends — 2025</h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, border: '1px solid #eee', borderRadius: 0 }}
            itemStyle={{ color: '#333' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
          <Bar dataKey="enrollments" name="Enrollments" fill="#36c6d3" barSize={16} />
          <Bar dataKey="completions" name="Completions" fill="#8BC34A" barSize={16} />
          <Line dataKey="certificates" name="Certificates" stroke="#212a7a" strokeWidth={2} dot={{ r: 3, fill: '#212a7a' }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
