import { Hono } from 'hono';
import { z } from 'zod';
import { searchChords } from './search.handler.js';

const querySchema = z.object({
  q: z.string().min(2),
  limit: z.coerce.number().min(1).max(50).optional(),
});

export const searchRoutes = new Hono();

searchRoutes.get('/search', async (c) => {
  const parsed = querySchema.safeParse({
    q: c.req.query('q'),
    limit: c.req.query('limit'),
  });

  if (!parsed.success) {
    return c.json({ error: 'Parâmetro q é obrigatório (mínimo 2 caracteres)' }, 400);
  }

  try {
    const results = await searchChords(parsed.data.q, parsed.data.limit);
    return c.json({ data: results });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Erro interno na busca' }, 500);
  }
});
