import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { articleSchema } from '@/lib/validation';

const include = { category: true, user: { select: { id: true, username: true } } };

type Context = { params: Promise<{ id: string }> };

async function ownedArticle(request: Request, context: Context) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const { id } = await context.params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return errorResponse(404, 'Article not found');
  if (article.userId !== admin.id) return errorResponse(403, 'You can only manage your own articles');

  return { admin, article, id };
}

export async function PUT(request: Request, context: Context) {
  const owned = await ownedArticle(request, context);
  if (owned instanceof Response) return owned;

  const parsed = articleSchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid article data');

  const category = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!category) return errorResponse(404, 'Category not found');

  const article = await prisma.article.update({
    where: { id: owned.id },
    data: { ...parsed.data, imageUrl: parsed.data.imageUrl ?? null },
    include,
  });

  return NextResponse.json(article);
}

export async function DELETE(request: Request, context: Context) {
  const owned = await ownedArticle(request, context);
  if (owned instanceof Response) return owned;

  const article = await prisma.article.delete({ where: { id: owned.id } });
  return NextResponse.json(article);
}
