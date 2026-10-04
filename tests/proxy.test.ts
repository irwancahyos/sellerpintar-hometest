import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

process.env.JWT_SECRET = 'test-secret-that-is-long-enough';

describe('route proxy', () => {
  it('redirects a forged admin role cookie without a valid token', async () => {
    const response = await proxy(new NextRequest('http://localhost/admin/article', {
      headers: { cookie: 'role=Admin; token=forged' },
    }));

    expect(response.headers.get('location')).toContain('/login');
  });
});
