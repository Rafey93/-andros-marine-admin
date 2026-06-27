import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const studentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  rank: z.string().min(1),
  course: z.string().min(1),
  enrollmentDate: z.string().min(1),
  status: z.enum(['Active', 'Inactive', 'Completed']),
  progress: z.number().int().min(0).max(100).default(0),
  riskScore: z.number().int().min(0).max(100).default(0),
});

export async function GET() {
  try {
    const students = await prisma.student.findMany({ orderBy: { enrollmentDate: 'desc' } });
    return NextResponse.json(students.map(s => ({
      ...s,
      enrollmentDate: s.enrollmentDate.toISOString().slice(0, 10),
    })));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = studentSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid student data.', details: body.error.flatten() }, { status: 400 });
  }
  try {
    const student = await prisma.student.create({
      data: {
        ...body.data,
        enrollmentDate: new Date(body.data.enrollmentDate),
      },
    });
    return NextResponse.json({ ...student, enrollmentDate: student.enrollmentDate.toISOString().slice(0, 10) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
