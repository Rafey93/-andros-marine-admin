import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const snapshotSchema = z.object({
  timestamp: z.number(),
  dataUrl: z.string(),
});

const sessionSchema = z.object({
  id: z.string(),
  examId: z.string(),
  examTitle: z.string(),
  studentName: z.string(),
  startTime: z.number(),
  endTime: z.number().optional(),
  snapshotCount: z.number(),
  flagCount: z.number(),
  status: z.enum(['In Progress', 'Completed', 'Flagged']),
  score: z.number().optional(),
  flags: z.array(z.object({ type: z.string(), timestamp: z.number() })).optional(),
  snapshots: z.array(snapshotSchema).optional(),
});

export async function POST(request: Request) {
  const body = sessionSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid exam session payload.' }, { status: 400 });
  }

  const data = body.data;
  await prisma.examSession.upsert({
    where: { id: data.id },
    update: {
      examTitle: data.examTitle,
      studentName: data.studentName,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      snapshotCount: data.snapshotCount,
      flagCount: data.flagCount,
      status: data.status,
      score: data.score,
      flagsJson: data.flags ?? [],
    },
    create: {
      id: data.id,
      examId: data.examId,
      examTitle: data.examTitle,
      studentName: data.studentName,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      snapshotCount: data.snapshotCount,
      flagCount: data.flagCount,
      status: data.status,
      score: data.score,
      flagsJson: data.flags ?? [],
    },
  });

  if (data.snapshots?.length) {
    await prisma.snapshot.deleteMany({ where: { sessionId: data.id } });
    await prisma.snapshot.createMany({
      data: data.snapshots.map((snapshot) => ({
        sessionId: data.id,
        timestamp: new Date(snapshot.timestamp),
        dataUrl: snapshot.dataUrl,
      })),
    });
  }

  return NextResponse.json({ ok: true });
}
