// Utility functions for authentication

/**
 * Decode JWT token (client-side only - for reading payload, not verification)
 * Note: This doesn't verify the token, just reads the payload
 */
export function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get user info from cookies
 */
export function getUserFromCookies() {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  
  if (!accessTokenCookie) return null;
  
  const token = accessTokenCookie.split('=')[1];
  return decodeJWT(token);
}

/**
 * Get user role from cookies
 */
export function getUserRole() {
  const user = getUserFromCookies();
  return user?.role || 'user';
}

/**
 * Get user name from cookies
 */
export function getUserName() {
  const user = getUserFromCookies();
  return user?.name || user?.username || user?.email || 'User';
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return getUserFromCookies() !== null;
}
