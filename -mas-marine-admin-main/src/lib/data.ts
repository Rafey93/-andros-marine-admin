import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/db';
import {
  campaigns as mockCampaigns,
  certificates as mockCertificates,
  chartData as mockChartData,
  courses as mockCourses,
  exams as mockExams,
  mockExamSessions,
  riskTrendData,
  smartGroups as mockSmartGroups,
  students as mockStudents,
} from '@/lib/mock-data';
import type { Campaign, Certificate, Course, Exam, ExamSession, Student } from '@/types';

const dateOnly = (value: Date) => value.toISOString().slice(0, 10);

async function fallback<T>(query: () => Promise<T>, value: T): Promise<T> {
  noStore();
  try {
    return await query();
  } catch {
    return value;
  }
}

export function getStudents() {
  return fallback(
    async (): Promise<Student[]> =>
      (await prisma.student.findMany({ orderBy: { enrollmentDate: 'desc' } })).map((s) => ({
        ...s,
        status: s.status as Student['status'],
        enrollmentDate: dateOnly(s.enrollmentDate),
      })),
    mockStudents
  );
}

export function getCourses() {
  return fallback(
    async (): Promise<Course[]> =>
      (await prisma.course.findMany({ orderBy: { title: 'asc' } })).map((c) => ({
        ...c,
        status: c.status as Course['status'],
      })),
    mockCourses
  );
}

export function getCertificates() {
  return fallback(
    async (): Promise<Certificate[]> =>
      (await prisma.certificate.findMany({ orderBy: { issueDate: 'desc' } })).map((c) => ({
        ...c,
        status: c.status as Certificate['status'],
        issueDate: dateOnly(c.issueDate),
        expiryDate: dateOnly(c.expiryDate),
      })),
    mockCertificates
  );
}

export function getCampaigns() {
  return fallback(
    async (): Promise<Campaign[]> =>
      (await prisma.campaign.findMany({ orderBy: { deadline: 'asc' } })).map((c) => ({
        id: c.id,
        title: c.title,
        assignedGroup: c.assignedGroup,
        courses: Array.isArray(c.coursesJson) ? c.coursesJson.map(String) : [],
        deadline: dateOnly(c.deadline),
        completionRate: c.completionRate,
        status: c.status as Campaign['status'],
        totalAssigned: c.totalAssigned,
        completed: c.completed,
        description: c.description,
      })),
    mockCampaigns
  );
}

export function getChartData() {
  return fallback(
    () => prisma.chartMetric.findMany({ orderBy: { sortOrder: 'asc' } }),
    mockChartData
  );
}

export function getSmartGroups() {
  return fallback(() => prisma.smartGroup.findMany({ orderBy: { name: 'asc' } }), mockSmartGroups);
}

export function getExamSessions() {
  return fallback(
    async (): Promise<ExamSession[]> =>
      (await prisma.examSession.findMany({ orderBy: { startTime: 'desc' } })).map((s) => ({
        id: s.id,
        examId: s.examId,
        examTitle: s.examTitle,
        studentName: s.studentName,
        startTime: s.startTime.getTime(),
        endTime: s.endTime?.getTime(),
        snapshotCount: s.snapshotCount,
        flagCount: s.flagCount,
        status: s.status as ExamSession['status'],
        score: s.score ?? undefined,
      })),
    mockExamSessions
  );
}

export function getExam(id: string) {
  return fallback(
    async (): Promise<Exam | undefined> => {
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: { questions: { orderBy: { sortOrder: 'asc' } } },
      });
      if (!exam) return undefined;
      return {
        id: exam.id,
        title: exam.title,
        courseId: exam.courseId,
        duration: exam.duration,
        questions: exam.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: Array.isArray(q.optionsJson) ? q.optionsJson.map(String) : [],
          correctIndex: q.correctIndex,
        })),
      };
    },
    mockExams.find((exam) => exam.id === id)
  );
}

export async function getDashboardOverview() {
  const [students, courses, certificates, chartData] = await Promise.all([
    getStudents(),
    getCourses(),
    getCertificates(),
    getChartData(),
  ]);
  const completed = students.filter((student) => student.status === 'Completed').length;
  return {
    students,
    chartData,
    totals: {
      students: students.length,
      activeCourses: courses.filter((course) => course.status === 'Active').length,
      certificates: certificates.length,
      completionRate: students.length ? Math.round((completed / students.length) * 100) : 0,
    },
  };
}

export { riskTrendData };
