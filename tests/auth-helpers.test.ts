import { describe, expect, it } from 'vitest';
import { getAuthenticatedUser, signToken } from '@/lib/auth';

process.env.JWT_SECRET = 'test-secret-that-is-long-enough';

describe('authentication helpers', () => {
  it('round-trips a signed user token', async () => {
    const token = await signToken({ id: 'user-1', username: 'ana', role: 'Admin' });
    const request = new Request('http://localhost/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    await expect(getAuthenticatedUser(request)).resolves.toEqual({ id: 'user-1', username: 'ana', role: 'Admin' });
  });

  it('rejects a missing or malformed bearer token', async () => {
    await expect(getAuthenticatedUser(new Request('http://localhost/api/auth/profile'))).resolves.toBeNull();
    await expect(getAuthenticatedUser(new Request('http://localhost/api/auth/profile', {
      headers: { Authorization: 'Bearer invalid' },
    }))).resolves.toBeNull();
  });
});
