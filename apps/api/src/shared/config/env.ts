import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  CIFRACLUB_BASE_URL: z.string().url().default('https://www.cifraclub.com.br'),
});

export const env = envSchema.parse(process.env);
