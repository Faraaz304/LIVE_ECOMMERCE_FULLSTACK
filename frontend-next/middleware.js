// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// It's crucial to use a strong, environment-specific secret key in production.
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-super-secret-key-12345');

// Define role-based access rules.
// Keys are roles, values are arrays of URL prefixes that role can access.
const accessRules = {
  admin: ['/admin'], // Admin can access all routes starting with /admin
  seller: ['/seller'], // Seller can access all routes starting with /seller
  user: ['/user', '/products', '/profile', '/reservations'], // User can access routes starting with /user or these specific paths
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Define truly public routes (no authentication or authorization check needed)
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 2. Authentication: Check for accessToken
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    // If no accessToken, redirect to login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Optionally, add a redirect query param to return user to original page after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  let payload;
  try {
    // Verify the JWT token
    const { payload: jwtPayload } = await jwtVerify(accessToken, JWT_SECRET);
    payload = jwtPayload;
  } catch (err) {
    console.error('JWT Verification Error:', err);
    // If token is invalid or expired, redirect to login and clear the cookie
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    const response = NextResponse.redirect(url);
    response.cookies.delete('accessToken'); // Clear invalid/expired token
    return response;
  }

  // 3. Authorization: Check user's role against protected routes
  const userRole = payload.role; // Assuming 'role' is part of your JWT payload

  // Check if the current path is covered by any role's access rules
  let isPathProtectedByRules = false;
  for (const role in accessRules) {
    if (accessRules[role].some(prefix => pathname.startsWith(prefix))) {
      isPathProtectedByRules = true;
      break;
    }
  }

  // If the path is protected by our rules and the user's role does not match
  if (isPathProtectedByRules) {
    const userHasAccess = accessRules[userRole]?.some(prefix => pathname.startsWith(prefix)) || false;

    if (!userHasAccess) {
      console.warn(`Unauthorized access attempt: User role '${userRole}' tried to access '${pathname}'.`);
      const url = request.nextUrl.clone();
      // Redirect to a role-specific dashboard if unauthorized
      if (userRole === 'admin') url.pathname = '/admin/dashboard';
      else if (userRole === 'seller') url.pathname = '/seller/dashboard';
      else if (userRole === 'user') url.pathname = '/user/products'; // Default for user
      else url.pathname = '/login'; // Fallback for undefined roles or general denial
      return NextResponse.redirect(url);
    }
  }

  // If authenticated and authorized, proceed
  return NextResponse.next();
}

export const config = {
  // The matcher array defines which paths the middleware should run on.
  // This regex matches all paths EXCEPT:
  // - API routes (/api/...)
  // - Next.js static files (_next/static/...)
  // - Next.js internal files (_next/image, favicon.ico)
  // - Explicitly public routes already handled (login, register, and root path '$')
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|$).*)',
  ],
};


// ----------------------------------------------------------------------------------------------


// // middleware.js
// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET_KEY || 'fallback-secret-change-in-prod'
// );
// const accessRules = {
//   ADMIN: ['/admin'],
//   SELLER: ['/seller'],
//   USER: ['/user', '/products', '/profile', '/reservations'],
// };

// const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];

// function redirectToLogin(req, returnPath) {
//   const url = req.nextUrl.clone();
//   url.pathname = '/login';
//   url.searchParams.set('redirect', returnPath);
//   return NextResponse.redirect(url);
// }

// function redirectToDashboard(role, req) {
//   const url = req.nextUrl.clone();
//   if (role === 'ADMIN') url.pathname = '/admin/dashboard';
//   else if (role === 'SELLER') url.pathname = '/seller/dashboard';
//   else if (role === 'USER') url.pathname = '/user/products';
//   else url.pathname = '/login';
//   return NextResponse.redirect(url);
// }

// export async function middleware(request) {
//   const { pathname, origin } = request.nextUrl;

//   const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
//   if (isPublic) {
//     // **Special case**: after a successful login/register we receive JSON with a token.
//     // Intercept the API response, set httpOnly cookie, then redirect client.
//     if (['/api/auth/login', '/api/auth/register'].includes(pathname) && request.method === 'POST') {
//       const cloned = request.clone();
//       const body = await cloned.text();

//       let json;
//       try { json = JSON.parse(body); } catch { return NextResponse.next(); }

//       const { token, role, email } = json;
//       if (token && role) {
//         const response = NextResponse.redirect(new URL('/', origin));
//         response.cookies.set('accessToken', token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'strict',
//           path: '/',
//           maxAge: 15 * 60, // 15 min – matches your JWT iat/exp
//         });
//         return response;
//       }
//     }
//     return NextResponse.next();
//   }

//   const accessToken = request.cookies.get('accessToken')?.value;
//   if (!accessToken) return redirectToLogin(request, pathname);

//   let payload;
//   try {
//     const { payload: p } = await jwtVerify(accessToken, JWT_SECRET);
//     payload = p;
//   } catch (err) {
//     console.error('JWT verify error:', err.message);
//     const resp = redirectToLogin(request, pathname);
//     resp.cookies.delete('accessToken');
//     return resp;
//   }

//   const userRole = payload.role?.toUpperCase(); // your JWT contains "ADMIN"

//   const protectedBySomeRole = Object.values(accessRules).some(prefixes =>
//     prefixes.some(p => pathname.startsWith(p))
//   );

//   if (!protectedBySomeRole) return NextResponse.next(); // not a protected area
//   const allowed = (accessRules[userRole] || []).some(p => pathname.startsWith(p));
//   if (!allowed) return redirectToDashboard(userRole, request);

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next|favicon.ico).*)', // Exclude API and Next.js internal assets
//   ],
// };
