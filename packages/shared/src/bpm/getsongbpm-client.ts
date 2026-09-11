import { scoreNameMatch, scoreSongMatch } from './normalize-search.js';
import {
  GETSONGBPM_ATTRIBUTION,
  MAX_PROVIDER_BPM,
  MIN_PROVIDER_BPM,
  type GetSongBpmHit,
  type GetSongBpmLookupResult,
} from './types.js';

const DEFAULT_BASE_URL = 'https://api.getsongbpm.com';
const REQUEST_TIMEOUT_MS = 5_000;
const USER_AGENT = 'CifraHub/1.0 (local BFF; +https://github.com/LucasArcega/rebel1)';

export class GetSongBpmProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GetSongBpmProviderError';
  }
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const readString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const parseTempo = (value: unknown): number | null => {
  const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
  if (!Number.isFinite(numeric)) {
    return null;
  }

  if (numeric < MIN_PROVIDER_BPM || numeric > MAX_PROVIDER_BPM) {
    return null;
  }

  return Math.round(numeric);
};

const parseHit = (value: unknown): GetSongBpmHit | null => {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const artist = asRecord(record.artist);
  const id = readString(record.song_id) ?? readString(record.id);
  const title = readString(record.song_title) ?? readString(record.title);
  const artistName = readString(artist?.name) ?? readString(record.name);
  const tempo = parseTempo(record.tempo);

  if (!id || !title || !artistName || tempo === null) {
    return null;
  }

  const timeSig = record.time_sig === undefined || record.time_sig === null
    ? undefined
    : String(record.time_sig);
  const key = readString(record.key_of);

  return {
    id,
    title,
    artistName,
    tempo,
    timeSig,
    key,
  };
};

export const parseGetSongSearchPayload = (payload: unknown): GetSongBpmHit[] => {
  const root = asRecord(payload);
  if (!root) {
    return [];
  }

  const search = root.search;
  if (Array.isArray(search)) {
    return search.map(parseHit).filter((hit): hit is GetSongBpmHit => hit !== null);
  }

  return [];
};

export const pickBestGetSongMatch = (
  hits: GetSongBpmHit[],
  artistName: string,
  songName: string,
): GetSongBpmHit | null => {
  const ranked = hits
    .map((hit) => ({
      hit,
      artistScore: scoreNameMatch(hit.artistName, artistName),
      titleScore: scoreNameMatch(hit.title, songName),
      score: scoreSongMatch(hit, artistName, songName),
    }))
    .filter((entry) => entry.artistScore > 0 && entry.titleScore > 0 && entry.score >= 3)
    .sort((left, right) => right.score - left.score);

  return ranked[0]?.hit ?? null;
};

const buildLookup = (type: 'both' | 'song', artistName: string, songName: string) => {
  if (type === 'both') {
    return `song:${songName} artist:${artistName}`;
  }

  return songName;
};

const requestSearch = async (options: {
  apiKey: string;
  baseUrl: string;
  type: 'both' | 'song';
  artistName: string;
  songName: string;
  fetchFn: typeof fetch;
}): Promise<GetSongBpmHit[]> => {
  const url = new URL('/search/', options.baseUrl.replace(/\/$/, ''));
  url.searchParams.set('type', options.type);
  url.searchParams.set('lookup', buildLookup(options.type, options.artistName, options.songName));
  url.searchParams.set('limit', '10');

  const response = await options.fetchFn(url, {
    headers: {
      Accept: 'application/json',
      'X-API-KEY': options.apiKey,
      'User-Agent': USER_AGENT,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.status === 429 || response.status >= 500) {
    throw new GetSongBpmProviderError(`GetSongBPM unavailable (${response.status})`);
  }

  if (response.status === 401 || response.status === 403) {
    throw new GetSongBpmProviderError('GetSongBPM rejected the API key');
  }

  if (!response.ok) {
    throw new GetSongBpmProviderError(`GetSongBPM request failed (${response.status})`);
  }

  return parseGetSongSearchPayload(await response.json());
};

export const searchGetSongBpm = async (options: {
  apiKey: string;
  artistName: string;
  songName: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}): Promise<GetSongBpmHit[]> => {
  const fetchFn = options.fetchFn ?? fetch;
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;

  try {
    const bothHits = await requestSearch({
      apiKey: options.apiKey,
      baseUrl,
      type: 'both',
      artistName: options.artistName,
      songName: options.songName,
      fetchFn,
    });

    if (bothHits.length > 0) {
      return bothHits;
    }
  } catch (error) {
    if (!(error instanceof GetSongBpmProviderError)) {
      throw error;
    }
  }

  return requestSearch({
    apiKey: options.apiKey,
    baseUrl,
    type: 'song',
    artistName: options.artistName,
    songName: options.songName,
    fetchFn,
  });
};

export const lookupGetSongBpm = async (options: {
  apiKey: string;
  artistName: string;
  songName: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}): Promise<GetSongBpmLookupResult | null> => {
  const hits = await searchGetSongBpm(options);
  const match = pickBestGetSongMatch(hits, options.artistName, options.songName);

  if (!match) {
    return null;
  }

  return {
    bpm: match.tempo,
    key: match.key,
    timeSig: match.timeSig,
    externalId: match.id,
    source: 'getsongbpm',
    attribution: GETSONGBPM_ATTRIBUTION,
  };
};
