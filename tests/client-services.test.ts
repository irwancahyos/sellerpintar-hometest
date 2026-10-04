import { beforeEach, describe, expect, it, vi } from 'vitest';

const { axios } = vi.hoisted(() => ({
  axios: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('axios', () => ({ default: axios }));

import { loginUser } from '@/lib/api/auth';
import { getAllArticles, uploadArticleImage } from '@/service/admin-service/admin-service';

beforeEach(() => vi.clearAllMocks());

describe('client API services', () => {
  it('sends login requests to the same-origin API', async () => {
    axios.post.mockResolvedValue({ data: { token: 'token-1', role: 'Admin' } });

    await loginUser({ username: 'ana', password: 'password1', role: 'Admin' });

    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'ana', password: 'password1', role: 'Admin',
    }, expect.anything());
  });

  it('loads public articles from the same-origin API with filters', async () => {
    axios.get.mockResolvedValue({ data: { data: [], page: 1, limit: 9, total: 0 } });

    await getAllArticles('next', 1, 9, 'category-1');

    expect(axios.get).toHaveBeenCalledWith('/api/articles', {
      params: { page: 1, limit: 9, category: 'category-1', title: 'next' },
    });
  });

  it('uploads article images through the authenticated local endpoint', async () => {
    vi.stubGlobal('document', { cookie: 'token=token-1' });
    axios.post.mockResolvedValue({ data: { imageUrl: 'https://res.cloudinary.com/test/thumbnail.jpg' } });

    const imageUrl = await uploadArticleImage(new File(['image'], 'thumbnail.jpg', { type: 'image/jpeg' }));

    expect(imageUrl).toBe('https://res.cloudinary.com/test/thumbnail.jpg');
    expect(axios.post).toHaveBeenCalledWith('/api/articles/upload', expect.any(FormData), {
      headers: { Authorization: 'Bearer token-1' },
    });
    vi.unstubAllGlobals();
  });
});
