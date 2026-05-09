'use client';

import Cookies from 'js-cookie';

const COOKIE_NAME = 'mas_admin_auth';
const VALID_CREDENTIALS = { username: 'maya', password: 'maya@2026' };

export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password;
}

export function setAuthCookie(): void {
  Cookies.set(COOKIE_NAME, 'true', { expires: 1, sameSite: 'strict' });
}

export function clearAuthCookie(): void {
  Cookies.remove(COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  return !!Cookies.get(COOKIE_NAME);
}
