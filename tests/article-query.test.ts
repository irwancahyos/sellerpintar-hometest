import { beforeEach, describe, expect, it, vi } from 'vitest';

const { article } = vi.hoisted(() => ({
  article: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: (queries: unknown[]) => Promise.all(queries),
    article,
  },
}));

import { GET } from '@/app/api/articles/route';

beforeEach(() => vi.clearAllMocks());

describe('article query route', () => {
  it('returns a paginated list filtered by category and title', async () => {
    article.findMany.mockResolvedValue([]);
    article.count.mockResolvedValue(0);

    const response = await GET(new Request('http://localhost/api/articles?page=2&limit=9&category=cat-1&title=next'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: [], page: 2, limit: 9, total: 0 });
    expect(article.findMany).toHaveBeenCalledWith(expect.objectContaining({
      skip: 9,
      take: 9,
      where: { categoryId: 'cat-1', title: { contains: 'next', mode: 'insensitive' } },
    }));
  });
});
