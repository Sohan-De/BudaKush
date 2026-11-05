import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, safeEqual, sessionToken } from '@/lib/admin-session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: 'Administration désactivée (ADMIN_PASSWORD non configuré)' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const provided = typeof body?.password === 'string' ? body.password : '';
  if (!provided || !safeEqual(provided, password)) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, await sessionToken(password), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
