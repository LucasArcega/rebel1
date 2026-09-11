import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

const loadLocalEnv = () => {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    return;
  }

  for (const rawLine of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separator = line.indexOf('=');
    if (separator <= 0) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadLocalEnv();

const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CIFRACLUB_BASE_URL: z.string().url().default('https://www.cifraclub.com.br'),
  GETSONGBPM_API_KEY: z.preprocess(blankToUndefined, z.string().min(1).optional()),
  GETSONGBPM_BASE_URL: z.preprocess(
    blankToUndefined,
    z.string().url().default('https://api.getsongbpm.com'),
  ),
});

export const env = envSchema.parse(process.env);
