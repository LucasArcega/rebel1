import { buildFetchUrl, parseCifraClubHtml } from '../../../entities/chord/lib/parser.js';
import type { InstrumentSlug } from '../../../entities/chord/model/types.js';
import { env } from '../../../shared/config/env.js';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

export class ChordNotFoundError extends Error {
  constructor(message = 'Cifra não encontrada') {
    super(message);
    this.name = 'ChordNotFoundError';
  }
}

export const getChord = async (params: {
  artist: string;
  song: string;
  instrument?: InstrumentSlug;
  version?: string;
}) => {
  const url = buildFetchUrl(
    env.CIFRACLUB_BASE_URL,
    params.artist,
    params.song,
    params.instrument,
    params.version,
  );

  const response = await fetch(url, { headers: BROWSER_HEADERS });

  if (response.status === 404) {
    throw new ChordNotFoundError();
  }

  if (!response.ok) {
    throw new Error(`Falha ao buscar cifra: ${response.status}`);
  }

  const html = await response.text();
  const parsed = parseCifraClubHtml(
    html,
    params.artist,
    params.song,
    env.CIFRACLUB_BASE_URL,
    params.instrument ?? 'cifra-group',
    params.version ?? 'principal',
  );

  if (!parsed) {
    throw new ChordNotFoundError('Não foi possível extrair a cifra do HTML');
  }

  return parsed;
};
