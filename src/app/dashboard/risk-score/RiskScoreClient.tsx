'use client';

import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import type { Student, SmartGroup } from '@/types';

const orgScore = 73;
const radialData = [
  { name: 'Score', value: orgScore, fill: orgScore >= 76 ? '#8BC34A' : orgScore >= 50 ? '#FFCA28' : '#F44336' },
];

const riskLabel = (score: number) =>
  score >= 76 ? { label: 'Low Risk', color: 'text-green-600', bg: 'bg-mas-success/10' }
  : score >= 50 ? { label: 'Medium Risk', color: 'text-yellow-600', bg: 'bg-mas-warning/10' }
  : { label: 'High Risk', color: 'text-red-600', bg: 'bg-red-50' };

export default function RiskScoreClient({
  students,
  smartGroups,
  riskTrendData,
}: {
  students: Student[];
  smartGroups: SmartGroup[];
  riskTrendData: { month: string; score: number }[];
}) {
  const atRisk = students.filter(s => s.riskScore < 50).sort((a, b) => a.riskScore - b.riskScore);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Risk & Compliance Score</h1>
        <p className="text-sm text-gray-500 mt-0.5">Organization-wide training compliance monitoring</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Org gauge */}
        <div className="bg-white p-6 flex flex-col items-center">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 self-start">Org Compliance Score</h2>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="65%" outerRadius="90%"
                startAngle={210} endAngle={-30}
                data={radialData}
              >
                <RadialBar dataKey="value" cornerRadius={0} background={{ fill: '#f0f0f0' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{orgScore}</span>
              <span className="text-xs text-gray-400 uppercase tracking-wider">/ 100</span>
            </div>
          </div>
          <div className="mt-3 px-3 py-1.5 bg-mas-warning/10 text-yellow-700 text-xs font-semibold uppercase tracking-wider">
            Medium Risk
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Improvement needed in cadet and ratings groups</p>
        </div>

        {/* Score trend */}
        <div className="bg-white p-5 xl:col-span-2">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Score Trend — Last 6 Months</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={riskTrendData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#999' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 0 }} />
              <Line dataKey="score" name="Compliance Score" stroke="#36c6d3" strokeWidth={2.5} dot={{ r: 4, fill: '#36c6d3' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Group breakdown */}
      <div className="bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Score by Group</h2>
        <div className="space-y-3">
          {smartGroups.map(group => {
            const risk = riskLabel(group.avgRiskScore);
            return (
              <div key={group.id} className="flex items-center gap-4">
                <div className="w-36 text-sm font-medium text-gray-700 truncate flex-shrink-0">{group.name}</div>
                <div className="flex-1 h-2 bg-gray-100">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${group.avgRiskScore}%`,
                      backgroundColor: group.avgRiskScore >= 76 ? '#8BC34A' : group.avgRiskScore >= 50 ? '#FFCA28' : '#F44336'
                    }}
                  />
                </div>
                <div className="w-8 text-xs font-bold text-gray-700 text-right">{group.avgRiskScore}</div>
                <span className={cn('px-2 py-0.5 text-xs font-semibold uppercase tracking-wider w-24 text-center flex-shrink-0', risk.bg, risk.color)}>
                  {risk.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* At-risk students */}
      <div className="bg-white">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">High Risk Students</h2>
          <span className="ml-auto text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5">{atRisk.length} students</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Student', 'Rank', 'Course', 'Progress', 'Risk Score'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {atRisk.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{s.rank}</td>
                  <td className="px-5 py-3 text-gray-600 text-xs max-w-[200px] truncate">{s.course}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100">
                        <div className="h-full bg-red-300" style={{ width: `${s.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-bold text-red-500 text-lg">{s.riskScore}</span>
                    <span className="text-gray-300 text-xs">/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
