import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL('/login', request.url));
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const jwtSecret = process.env.JWT_SECRET;
  if (!token || !jwtSecret) return redirectToLogin(request);

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret));
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isUserPath = request.nextUrl.pathname.startsWith('/user');

    if ((isAdminPath && payload.role === 'Admin') || (isUserPath && payload.role === 'User')) {
      return NextResponse.next();
    }
  } catch {
    return redirectToLogin(request);
  }

  return redirectToLogin(request);
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
};
