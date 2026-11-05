import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, safeEqual, sessionToken } from '@/lib/admin-session';

// Protège /admin et /api/admin.
// Connexion par formulaire (/admin/login) -> cookie de session HttpOnly.
// Si ADMIN_PASSWORD n'est pas défini, l'accès admin est bloqué (fail closed).
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Page de connexion et route de connexion : accessibles sans session
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  const isApi = pathname.startsWith('/api/');
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return isApi
      ? NextResponse.json({ error: 'ADMIN_PASSWORD non configuré' }, { status: 503 })
      : new NextResponse('Administration désactivée : ADMIN_PASSWORD non configuré.', { status: 503 });
  }

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value || '';
  const expected = await sessionToken(password);
  if (cookie && safeEqual(cookie, expected)) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
  }
  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}
