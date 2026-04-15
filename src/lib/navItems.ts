import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  BarChart2,
  Megaphone,
  ShieldAlert,
  Video,
  ClipboardList,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard',       href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Students',        href: '/dashboard/students',    icon: Users },
  { label: 'Courses',         href: '/dashboard/courses',     icon: BookOpen },
  { label: 'Certificates',    href: '/dashboard/certificates', icon: Award },
  { label: 'Reports',         href: '/dashboard/reports',     icon: BarChart2 },
  { label: 'Campaigns',       href: '/dashboard/campaigns',   icon: Megaphone },
  { label: 'Risk Score',      href: '/dashboard/risk-score',  icon: ShieldAlert },
  { label: 'Exams',           href: '/dashboard/exam/1',      icon: ClipboardList },
  { label: 'Proctoring',      href: '/dashboard/proctoring',  icon: Video },
  { label: 'Settings',        href: '/dashboard/settings',    icon: Settings },
];
