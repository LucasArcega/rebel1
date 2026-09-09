import {
  buildFetchUrl,
  parseCifraClubHtml,
  searchSongs,
  type ChordSong,
  type InstrumentSlug,
  type SearchResult,
} from '@cifra-hub/shared';

const CIFRACLUB_BASE_URL = 'https://www.cifraclub.com.br';

const MOBILE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

export interface FetchChordParams {
  artist: string;
  song: string;
  instrument?: InstrumentSlug;
  version?: string;
}

/** Busca cifra direto do Cifra Club — sem `apps/api` (self-hosted no dispositivo). */
export const fetchChordDirect = async (params: FetchChordParams): Promise<ChordSong> => {
  const url = buildFetchUrl(
    CIFRACLUB_BASE_URL,
    params.artist,
    params.song,
    params.instrument,
    params.version,
  );

  const response = await fetch(url, { headers: MOBILE_HEADERS });

  if (response.status === 404) {
    throw new Error('NOT_FOUND_ON_CC');
  }

  if (!response.ok) {
    throw new Error(`FETCH_FAILED:${response.status}`);
  }

  const html = await response.text();
  const parsed = parseCifraClubHtml(
    html,
    params.artist,
    params.song,
    CIFRACLUB_BASE_URL,
    params.instrument ?? 'cifra-group',
    params.version ?? 'principal',
  );

  if (!parsed) {
    throw new Error('PARSE_FAILED');
  }

  return parsed;
};

/** Busca músicas via Solr público — sem API local. */
export const searchChordsDirect = (query: string, limit = 20): Promise<SearchResult[]> =>
  searchSongs(query, limit);
