import { beforeEach, describe, expect, it, vi } from 'vitest';

const { category } = vi.hoisted(() => ({
  category: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: (queries: unknown[]) => Promise.all(queries),
    category,
  },
}));

import { GET } from '@/app/api/categories/route';

beforeEach(() => vi.clearAllMocks());

describe('category query route', () => {
  it('returns the pagination shape consumed by the category UI', async () => {
    category.findMany.mockResolvedValue([]);
    category.count.mockResolvedValue(0);

    const response = await GET(new Request('http://localhost/api/categories?page=1&limit=10&search=tech'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: [], totalData: 0, totalPages: 0, currentPage: 1 });
    expect(category.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { name: { contains: 'tech', mode: 'insensitive' } },
      skip: 0,
      take: 10,
    }));
  });
});
