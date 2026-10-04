import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { articleSchema } from '@/lib/validation';

const include = { category: true, user: { select: { id: true, username: true } } };

function pagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? '10') || 10));
  return { page, limit };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (articleId) {
    const article = await prisma.article.findUnique({ where: { id: articleId }, include });
    return article ? NextResponse.json(article) : errorResponse(404, 'Article not found');
  }

  const { page, limit } = pagination(searchParams);
  const category = searchParams.get('category')?.trim();
  const title = searchParams.get('title')?.trim();
  const where = {
    ...(category ? { categoryId: category } : {}),
    ...(title ? { title: { contains: title, mode: 'insensitive' as const } } : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.article.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({ data, page, limit, total });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid article data');

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return errorResponse(404, 'Category not found');

  const article = await prisma.article.create({
    data: { ...parsed.data, userId: admin.id, imageUrl: parsed.data.imageUrl ?? null },
    include,
  });

  return NextResponse.json(article, { status: 201 });
}
