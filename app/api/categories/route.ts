import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { categorySchema } from '@/lib/validation';

function pagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '10') || 10));
  return { page, limit };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { page, limit } = pagination(searchParams);
  const search = searchParams.get('search')?.trim();
  const where = search ? { name: { contains: search, mode: 'insensitive' as const } } : {};

  const [data, totalData] = await prisma.$transaction([
    prisma.category.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.category.count({ where }),
  ]);

  return NextResponse.json({ data, totalData, totalPages: Math.ceil(totalData / limit), currentPage: page });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid category data');

  const category = await prisma.category.create({ data: { name: parsed.data.name, userId: admin.id } });
  return NextResponse.json(category, { status: 201 });
}
