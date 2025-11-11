// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-super-secret-key-12345');

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ['/login', '/register', '/'];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);
    request.user = payload; // You can forward role info if needed
    return NextResponse.next();
  } catch (err) {
    console.error('JWT Error:', err);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    response.cookies.delete('accessToken');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};
