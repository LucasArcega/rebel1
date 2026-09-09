import { Hono } from 'hono';
import { z } from 'zod';
import type { InstrumentSlug } from '../../../entities/chord/model/types.js';
import { ChordNotFoundError, getChord } from './get-chord.handler.js';

const instrumentSchema = z.enum([
  'cifra-group',
  'lyrics',
  'bass',
  'drums',
  'guitar',
  'sheet',
  'harmonica',
  'keyboard',
  'ukulele',
  'viola',
  'guitarpro',
]);

const querySchema = z.object({
  instrument: instrumentSchema.optional(),
});

export const chordRoutes = new Hono();

chordRoutes.get('/health', (c) => c.json({ status: 'ok' }));

chordRoutes.get('/artists/:artist/songs/:song', async (c) => {
  const artist = c.req.param('artist');
  const song = c.req.param('song');

  const parsedQuery = querySchema.safeParse({
    instrument: c.req.query('instrument'),
  });

  if (!parsedQuery.success) {
    return c.json({ error: 'Parâmetro instrument inválido' }, 400);
  }

  try {
    const chord = await getChord({
      artist,
      song,
      instrument: parsedQuery.data.instrument as InstrumentSlug | undefined,
    });

    return c.json({ data: chord });
  } catch (error) {
    if (error instanceof ChordNotFoundError) {
      return c.json({ error: error.message }, 404);
    }

    console.error(error);
    return c.json({ error: 'Erro interno ao buscar cifra' }, 500);
  }
});
