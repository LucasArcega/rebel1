import { Hono } from 'hono';
import { z } from 'zod';
import { BpmRequestError, getBpm } from './get-bpm.handler.js';

const querySchema = z.object({
  artist: z.string().min(1),
  song: z.string().min(1),
  artistName: z.string().min(1).optional(),
  songName: z.string().min(1).optional(),
});

const statusByCode = {
  BPM_NOT_FOUND: 404,
  BPM_PROVIDER_UNAVAILABLE: 503,
  INVALID_PARAMS: 400,
  BPM_NOT_CONFIGURED: 501,
} as const;

export const bpmRoutes = new Hono();

bpmRoutes.get('/bpm', async (c) => {
  const parsed = querySchema.safeParse({
    artist: c.req.query('artist'),
    song: c.req.query('song'),
    artistName: c.req.query('artistName') || undefined,
    songName: c.req.query('songName') || undefined,
  });

  if (!parsed.success) {
    return c.json({ error: 'Parâmetros artist e song são obrigatórios', code: 'INVALID_PARAMS' }, 400);
  }

  try {
    const data = await getBpm(parsed.data);
    return c.json({ data });
  } catch (error) {
    if (error instanceof BpmRequestError) {
      return c.json({ error: error.message, code: error.code }, statusByCode[error.code]);
    }

    console.error(error);
    return c.json({ error: 'Erro interno ao buscar BPM', code: 'BPM_PROVIDER_UNAVAILABLE' }, 503);
  }
});
