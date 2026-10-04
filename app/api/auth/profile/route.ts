import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse(401, 'Authentication required');

  return NextResponse.json(user);
}
