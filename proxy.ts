// ******** Imports ********
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// ******** Function Declaration ********
export function proxy(request: NextRequest) {

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {

    // Optional: check role
    if (role === 'Admin' && request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    if (role === 'User' && request.nextUrl.pathname.startsWith('/user')) {
      return NextResponse.next();
    }

    // Role doesn't match path
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (err) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
};