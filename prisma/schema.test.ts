import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Prisma schema', () => {
  it('defines the user, category, and article relationships', () => {
    const schema = readFileSync(new URL('./schema.prisma', import.meta.url), 'utf8');

    expect(schema).toContain('enum Role');
    expect(schema).toContain('model User');
    expect(schema).toMatch(/username\s+String\s+@unique/);
    expect(schema).toMatch(/passwordHash\s+String/);
    expect(schema).toContain('model Category');
    expect(schema).toContain('model Article');
    expect(schema).toContain('categoryId String');
    expect(schema).toContain('onDelete: Restrict');
  });
});
