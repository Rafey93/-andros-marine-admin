export interface Student {
  id: string;
  name: string;
  email: string;
  rank: string;
  course: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Completed';
  progress: number;
  riskScore: number;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  enrolledCount: number;
  completionRate: number;
  status: 'Active' | 'Inactive';
  color: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
  certificateNo: string;
  status: 'Valid' | 'Expired' | 'Revoked';
}

export interface ChartDataPoint {
  month: string;
  enrollments: number;
  completions: number;
  certificates: number;
}

export interface Campaign {
  id: string;
  title: string;
  assignedGroup: string;
  courses: string[];
  deadline: string;
  completionRate: number;
  status: 'Active' | 'Completed' | 'Scheduled' | 'Overdue';
  totalAssigned: number;
  completed: number;
  description: string;
}

export interface SmartGroup {
  id: string;
  name: string;
  criteria: string;
  memberCount: number;
  avgRiskScore: number;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  duration: number; // minutes
  questions: ExamQuestion[];
}

export interface ExamSession {
  id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  startTime: number;
  endTime?: number;
  snapshotCount: number;
  flagCount: number;
  status: 'In Progress' | 'Completed' | 'Flagged';
  score?: number;
}

export interface Snapshot {
  timestamp: number;
  dataUrl: string;
}

export interface Flag {
  type: 'tab_switch' | 'camera_blocked' | 'fullscreen_exit';
  timestamp: number;
}
