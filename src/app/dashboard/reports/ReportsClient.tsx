'use client';

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { ChartDataPoint } from '@/types';

const courseCompletionData = [
  { name: 'STCW Safety',    value: 74, color: '#36c6d3' },
  { name: 'Firefighting',   value: 81, color: '#F44336' },
  { name: 'First Aid',      value: 68, color: '#8BC34A' },
  { name: 'Survival',       value: 77, color: '#FFCA28' },
  { name: 'Navigation',     value: 55, color: '#212a7a' },
  { name: 'GMDSS',          value: 63, color: '#9C27B0' },
];

export default function ReportsClient({ chartData }: { chartData: ChartDataPoint[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Year-to-date training metrics — 2025</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Enrollments YTD', value: '425' },
          { label: 'Avg. Completion Rate',  value: '71%' },
          { label: 'Certs This Quarter',    value: '87' },
          { label: 'At-Risk Students',      value: '34' },
        ].map(item => (
          <div key={item.label} className="bg-white p-4 border-l-4 border-teal">
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Enrollment bar chart — full width */}
      <div className="bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Monthly Enrollments</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 0 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="enrollments" name="Enrollments" fill="#36c6d3" barSize={20} />
            <Bar dataKey="completions" name="Completions" fill="#8BC34A" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Course completion breakdown — donut */}
        <div className="bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Completion by Course</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={courseCompletionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {courseCompletionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 0 }} formatter={(v) => [`${v}%`, 'Completion']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Certificates issued line chart */}
        <div className="bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Certificates Issued Monthly</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 0 }} />
              <Line dataKey="certificates" name="Certificates" stroke="#212a7a" strokeWidth={2.5} dot={{ r: 4, fill: '#212a7a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
