import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  rank: z.string().min(1).optional(),
  course: z.string().min(1).optional(),
  enrollmentDate: z.string().optional(),
  status: z.enum(['Active', 'Inactive', 'Completed']).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  riskScore: z.number().int().min(0).max(100).optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = updateSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid data.', details: body.error.flatten() }, { status: 400 });
  }
  try {
    const data = { ...body.data, ...(body.data.enrollmentDate ? { enrollmentDate: new Date(body.data.enrollmentDate) } : {}) };
    const student = await prisma.student.update({ where: { id }, data });
    return NextResponse.json({ ...student, enrollmentDate: student.enrollmentDate.toISOString().slice(0, 10) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
