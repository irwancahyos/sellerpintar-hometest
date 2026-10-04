import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse } from '@/lib/api-response';
import { registrationSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const parsed = registrationSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid registration data');

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await prisma.user.create({
      data: { username: parsed.data.username, passwordHash, role: parsed.data.role },
    });

    return NextResponse.json({ id: user.id, username: user.username, role: user.role }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return errorResponse(409, 'Username already exists');
    }

    return errorResponse(500, 'Unable to register user');
  }
}
