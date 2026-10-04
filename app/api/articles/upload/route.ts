import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { errorResponse } from '@/lib/api-response';
import { getCloudinary } from '@/lib/cloudinary';
import { THUMBNAIL_ALLOWED_TYPES, THUMBNAIL_MAX_BYTES } from '@/lib/validation';

export const runtime = 'nodejs';

function isImage(buffer: Buffer, type: string) {
  const isJpeg = type === 'image/jpeg' && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const isPng = type === 'image/png' && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  return isJpeg || isPng;
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin instanceof Response) return admin;

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return errorResponse(400, 'No file provided');
  if (!THUMBNAIL_ALLOWED_TYPES.includes(file.type as (typeof THUMBNAIL_ALLOWED_TYPES)[number])) {
    return errorResponse(400, 'Only JPG and PNG images are allowed');
  }
  if (file.size > THUMBNAIL_MAX_BYTES) return errorResponse(413, 'Image must be 1 MB or smaller');

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > THUMBNAIL_MAX_BYTES) return errorResponse(413, 'Image must be 5 MB or smaller');
  if (!isImage(buffer, file.type)) return errorResponse(400, 'File is not a valid JPG or PNG image');

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const upload = getCloudinary().uploader.upload_stream(
        { resource_type: 'image', folder: 'sellerpintar-articles' },
        (error, uploadResult) => error || !uploadResult ? reject(error ?? new Error('Missing upload result')) : resolve(uploadResult),
      );
      upload.end(buffer);
    });

    return NextResponse.json({ imageUrl: result.secure_url }, { status: 201 });
  } catch (error) {
    console.error('Cloudinary article upload failed', error);
    return errorResponse(502, 'Image upload failed, please try again');
  }
}
