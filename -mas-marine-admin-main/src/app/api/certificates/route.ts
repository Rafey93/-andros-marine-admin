import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const certSchema = z.object({
  studentName: z.string().min(1),
  courseName: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().min(1),
  certificateNo: z.string().min(1),
  status: z.enum(['Valid', 'Expired', 'Revoked']).default('Valid'),
});

export async function POST(request: Request) {
  const body = certSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return NextResponse.json({ error: 'Invalid certificate data.', details: body.error.flatten() }, { status: 400 });
  }
  try {
    const cert = await prisma.certificate.create({
      data: {
        ...body.data,
        issueDate: new Date(body.data.issueDate),
        expiryDate: new Date(body.data.expiryDate),
      },
    });
    return NextResponse.json({
      ...cert,
      issueDate: cert.issueDate.toISOString().slice(0, 10),
      expiryDate: cert.expiryDate.toISOString().slice(0, 10),
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
