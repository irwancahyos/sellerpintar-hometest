import { beforeEach, describe, expect, it, vi } from 'vitest';

const { compare, hash, user } = vi.hoisted(() => ({
  compare: vi.fn(),
  hash: vi.fn(),
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
}));

vi.mock('@/lib/prisma', () => ({ default: { user } }));
vi.mock('bcryptjs', () => ({ default: { compare, hash } }));

import { POST as register } from '@/app/api/auth/register/route';
import { POST as login } from '@/app/api/auth/login/route';

process.env.JWT_SECRET = 'test-secret-that-is-long-enough';

beforeEach(() => vi.clearAllMocks());

describe('auth routes', () => {
  it('registers an account without returning its password hash', async () => {
    hash.mockResolvedValue('hashed-password');
    user.create.mockResolvedValue({ id: 'user-1', username: 'ana', passwordHash: 'hashed-password', role: 'Admin' });

    const response = await register(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'ana', password: 'password1', role: 'Admin' }),
    }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ id: 'user-1', username: 'ana', role: 'Admin' });
    expect(hash).toHaveBeenCalledWith('password1', 12);
  });

  it('rejects invalid registration input', async () => {
    const response = await register(new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: '', password: 'short', role: 'Owner' }),
    }));

    expect(response.status).toBe(400);
  });

  it('returns a token only for valid login credentials', async () => {
    user.findUnique.mockResolvedValue({ id: 'user-1', username: 'ana', passwordHash: 'hashed-password', role: 'Admin' });
    compare.mockResolvedValue(true);

    const response = await login(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'ana', password: 'password1' }),
    }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(expect.objectContaining({ role: 'Admin', token: expect.any(String) }));
  });

  it('rejects a mismatched password', async () => {
    user.findUnique.mockResolvedValue({ id: 'user-1', username: 'ana', passwordHash: 'hashed-password', role: 'Admin' });
    compare.mockResolvedValue(false);

    const response = await login(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'ana', password: 'password1' }),
    }));

    expect(response.status).toBe(401);
  });
});
