import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('ui-system route', () => {
  it('is registered only behind import.meta.env.DEV', () => {
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'app-router.tsx'), 'utf8');
    expect(source).toContain("path=\"/ui-system\"");
    expect(source).toMatch(/import\.meta\.env\.DEV\s*\?\s*<Route path="\/ui-system"/);
  });
});
