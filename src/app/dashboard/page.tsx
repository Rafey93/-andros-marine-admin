import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import EnrollmentChart from '@/components/dashboard/EnrollmentChart';
import RecentStudentsTable from '@/components/dashboard/RecentStudentsTable';
import Link from 'next/link';
import { getDashboardOverview } from '@/lib/data';

export default async function DashboardPage() {
  const { students, chartData, totals } = await getDashboardOverview();

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, Maya. Here is what is happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={String(totals.students)}
          icon={Users}
          iconBg="bg-teal/10"
          iconColor="text-teal"
          borderColor="border-teal"
          change="+12% from last month"
          changeType="up"
        />
        <StatCard
          title="Active Courses"
          value={String(totals.activeCourses)}
          icon={BookOpen}
          iconBg="bg-navy/10"
          iconColor="text-navy"
          borderColor="border-navy"
          change="+2 this quarter"
          changeType="up"
        />
        <StatCard
          title="Certificates Issued"
          value={String(totals.certificates)}
          icon={Award}
          iconBg="bg-mas-success/10"
          iconColor="text-green-600"
          borderColor="border-mas-success"
          change="+34 this month"
          changeType="up"
        />
        <StatCard
          title="Completion Rate"
          value={`${totals.completionRate}%`}
          icon={TrendingUp}
          iconBg="bg-mas-warning/10"
          iconColor="text-yellow-600"
          borderColor="border-mas-warning"
          change="+5% from last month"
          changeType="up"
        />
      </div>

      {/* Chart */}
      <EnrollmentChart data={chartData} />

      {/* Recent students + quick actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <RecentStudentsTable students={students} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Enroll New Student', href: '/dashboard/students', color: 'bg-teal text-white hover:bg-teal-dark' },
              { label: 'Create Campaign', href: '/dashboard/campaigns', color: 'bg-navy text-white hover:bg-navy-dark' },
              { label: 'Issue Certificate', href: '/dashboard/certificates', color: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
              { label: 'Start Exam Session', href: '/dashboard/exam/1', color: 'border border-gray-300 text-gray-700 hover:bg-gray-50' },
              { label: 'View Risk Scores', href: '/dashboard/risk-score', color: 'border border-mas-danger text-mas-danger hover:bg-red-50' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`block w-full text-center py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${action.color}`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
