import { jwtVerify, SignJWT } from 'jose';
import { errorResponse } from './api-response';

export type AuthenticatedUser = {
  id: string;
  username: string;
  role: 'Admin' | 'User';
};

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is required');
  return new TextEncoder().encode(value);
}

export async function signToken(user: AuthenticatedUser) {
  return new SignJWT(user).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('24h').sign(secret());
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.id !== 'string' || typeof payload.username !== 'string' || (payload.role !== 'Admin' && payload.role !== 'User')) return null;
    return { id: payload.id, username: payload.username, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireAdmin(request: Request): Promise<AuthenticatedUser | Response> {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse(401, 'Authentication required');
  if (user.role !== 'Admin') return errorResponse(403, 'Admin role required');
  return user;
}
