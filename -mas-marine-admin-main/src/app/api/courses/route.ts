import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const courseSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  duration: z.string().min(1),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  color: z.string().min(1),
  enrolledCount: z.number().int().min(0).default(0),
  completionRate: z.number().int().min(0).max(100).default(0),
});

export async function POST(request: Request) {
  const body = courseSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid course data.', details: body.error.flatten() }, { status: 400 });
  }
  try {
    const course = await prisma.course.create({ data: body.data });
    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
