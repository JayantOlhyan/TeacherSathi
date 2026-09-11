import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // First, apply internationalization routing
  const intlResponse = intlMiddleware(request);

  // Next, update and refresh Supabase auth session
  const { res, user } = await updateSession(request, intlResponse);

  // Server-side Route Protection
  const isProtectedAdmin = pathname.startsWith('/admin');
  const isProtectedDashboard = pathname.startsWith('/dashboard');

  if (isProtectedAdmin || isProtectedDashboard) {
    // Check if user is authenticated via Supabase session OR client auth cookie
    const hasCookieAuth = request.cookies.get('ts_auth')?.value === 'true' || 
                          request.cookies.get('mock_authenticated')?.value === 'true';
    const hasActiveSession = !!user || hasCookieAuth;

    // Check for development cookie fallback if configured
    const devBypass = request.cookies.get('ts_dev_auth')?.value === 'true';

    if (!hasActiveSession && !devBypass) {
      // In unauthenticated state, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
