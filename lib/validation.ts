import { z } from 'zod';

export const roleSchema = z.enum(['Admin', 'User']);

export const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(8).max(72),
  role: roleSchema.optional(),
});

export const registrationSchema = credentialsSchema.extend({ role: roleSchema });

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const articleSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  categoryId: z.string().cuid(),
  imageUrl: z.string().url().nullable().optional(),
});
