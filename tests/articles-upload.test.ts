import { beforeEach, describe, expect, it, vi } from 'vitest';

const { uploadStream } = vi.hoisted(() => ({ uploadStream: vi.fn() }));

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: { upload_stream: uploadStream },
  },
}));

import { signToken } from '@/lib/auth';
import { POST } from '@/app/api/articles/upload/route';

process.env.JWT_SECRET = 'test-secret-that-is-long-enough';
process.env.CLOUDINARY_CLOUD_NAME = 'test-cloud';
process.env.CLOUDINARY_API_KEY = 'test-key';
process.env.CLOUDINARY_API_SECRET = 'test-secret';

const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);

async function adminHeaders(role: 'Admin' | 'User' = 'Admin') {
  const token = await signToken({ id: 'user-1', username: 'ana', role });
  return { Authorization: `Bearer ${token}` };
}

function request(file?: File, headers: HeadersInit = {}) {
  const body = new FormData();
  if (file) body.append('file', file);
  return new Request('http://localhost/api/articles/upload', { method: 'POST', headers, body });
}

beforeEach(() => vi.clearAllMocks());

describe('article thumbnail upload route', () => {
  it('requires an Admin token', async () => {
    const response = await POST(request(new File([jpeg], 'thumbnail.jpg', { type: 'image/jpeg' })));

    expect(response.status).toBe(401);
  });

  it('rejects a User token', async () => {
    const response = await POST(request(new File([jpeg], 'thumbnail.jpg', { type: 'image/jpeg' }), await adminHeaders('User')));

    expect(response.status).toBe(403);
  });

  it('rejects a missing file', async () => {
    const response = await POST(request(undefined, await adminHeaders()));

    expect(response.status).toBe(400);
  });

  it('rejects unsupported MIME types', async () => {
    const response = await POST(request(new File([jpeg], 'thumbnail.gif', { type: 'image/gif' }), await adminHeaders()));

    expect(response.status).toBe(400);
  });

  it('rejects files over 5 MB', async () => {
    const largeFile = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg', { type: 'image/jpeg' });
    const response = await POST(request(largeFile, await adminHeaders()));

    expect(response.status).toBe(413);
  });

  it('rejects a JPEG MIME type without JPEG bytes', async () => {
    const response = await POST(request(new File(['not an image'], 'thumbnail.jpg', { type: 'image/jpeg' }), await adminHeaders()));

    expect(response.status).toBe(400);
  });

  it('uploads a valid JPEG and returns its secure URL', async () => {
    uploadStream.mockImplementation((_options, callback) => ({
      end: () => callback(undefined, { secure_url: 'https://res.cloudinary.com/test/thumbnail.jpg' }),
    }));

    const response = await POST(request(new File([jpeg], 'thumbnail.jpg', { type: 'image/jpeg' }), await adminHeaders()));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ imageUrl: 'https://res.cloudinary.com/test/thumbnail.jpg' });
    expect(uploadStream).toHaveBeenCalledOnce();
  });
});
