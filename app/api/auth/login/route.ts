import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { credentialsSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const parsed = credentialsSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid login data');

  const user = await prisma.user.findUnique({ where: { username: parsed.data.username } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return errorResponse(401, 'Invalid username or password');
  }

  if (parsed.data.role && parsed.data.role !== user.role) {
    return errorResponse(401, 'Invalid username or password');
  }

  const token = await signToken({ id: user.id, username: user.username, role: user.role });
  return NextResponse.json({ token, role: user.role });
}
