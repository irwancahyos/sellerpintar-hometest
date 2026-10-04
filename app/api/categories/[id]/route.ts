import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import prisma from '@/lib/prisma';
import { categorySchema } from '@/lib/validation';

type Context = { params: Promise<{ id: string }> };

async function ownedCategory(request: Request, context: Context) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const { id } = await context.params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return errorResponse(404, 'Category not found');
  if (category.userId !== admin.id) return errorResponse(403, 'You can only manage your own categories');

  return { category, id };
}

export async function PUT(request: Request, context: Context) {
  const owned = await ownedCategory(request, context);
  if (owned instanceof Response) return owned;

  const parsed = categorySchema.safeParse(await request.json());
  if (!parsed.success) return errorResponse(400, 'Invalid category data');

  const category = await prisma.category.update({ where: { id: owned.id }, data: { name: parsed.data.name } });
  return NextResponse.json(category);
}

export async function DELETE(request: Request, context: Context) {
  const owned = await ownedCategory(request, context);
  if (owned instanceof Response) return owned;

  const articleCount = await prisma.article.count({ where: { categoryId: owned.id } });
  if (articleCount > 0) return errorResponse(409, 'Delete or move this category’s articles first');

  const category = await prisma.category.delete({ where: { id: owned.id } });
  return NextResponse.json(category);
}
