import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { createSession, SESSION_COOKIE } from '@/lib/session';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = loginSchema.safeParse(await request.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid login request.' }, { status: 400 });
    }

    // Always use environment-based auth if ADMIN_USERNAME is set
    if (process.env.ADMIN_USERNAME) {
      const username = process.env.ADMIN_USERNAME;
      const password = process.env.ADMIN_PASSWORD || 'Easy@1234';
      if (body.data.username !== username || body.data.password !== password) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
      }

      const token = await createSession({
        id: 'env-admin',
        name: process.env.ADMIN_NAME || 'Maya',
        username,
        role: 'admin',
      });
      const response = NextResponse.json({ ok: true });
      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      return response;
    }

    // Fall back to database auth if DATABASE_URL is set
    if (process.env.DATABASE_URL) {
      const user = await prisma.user.findUnique({ where: { username: body.data.username } });
      if (!user || !(await bcrypt.compare(body.data.password, user.passwordHash))) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
      }

      const token = await createSession({
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      });

      const response = NextResponse.json({ ok: true });
      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      return response;
    }

    // Fallback to default credentials
    const username = 'maya';
    const password = 'Easy@1234';
    if (body.data.username !== username || body.data.password !== password) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = await createSession({
      id: 'env-admin',
      name: 'Maya',
      username,
      role: 'admin',
    });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed. Please check server logs.' }, { status: 500 });
  }
}
