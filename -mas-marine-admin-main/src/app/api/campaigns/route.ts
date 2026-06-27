import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const campaignSchema = z.object({
  title: z.string().min(1),
  assignedGroup: z.string().min(1),
  deadline: z.string().min(1),
  description: z.string().default(''),
  status: z.enum(['Active', 'Completed', 'Scheduled', 'Overdue']).default('Scheduled'),
  totalAssigned: z.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  const body = campaignSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid campaign data.', details: body.error.flatten() }, { status: 400 });
  }
  try {
    const campaign = await prisma.campaign.create({
      data: {
        ...body.data,
        coursesJson: [],
        completionRate: 0,
        completed: 0,
        deadline: new Date(body.data.deadline),
      },
    });
    return NextResponse.json({
      ...campaign,
      courses: [],
      deadline: campaign.deadline.toISOString().slice(0, 10),
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
