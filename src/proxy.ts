import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'mas_admin_session';

export function proxy(request: NextRequest) {
  const isAuthed = request.cookies.get(SESSION_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !isAuthed) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname === '/' && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
