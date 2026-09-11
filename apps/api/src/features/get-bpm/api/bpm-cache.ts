import type { GetSongBpmLookupResult } from '@cifra-hub/shared';

interface ServerBpmHit {
  kind: 'hit';
  result: GetSongBpmLookupResult;
  cachedAt: number;
}

interface ServerBpmMiss {
  kind: 'miss';
  cachedAt: number;
}

type ServerBpmCacheEntry = ServerBpmHit | ServerBpmMiss;

const HIT_TTL_MS = 24 * 60 * 60 * 1000;
const MISS_TTL_MS = 60 * 60 * 1000;
const cache = new Map<string, ServerBpmCacheEntry>();

export const bpmCacheKey = (artistSlug: string, songSlug: string) =>
  `${artistSlug}/${songSlug}`;

const isExpired = (cachedAt: number, ttl: number) => Date.now() - cachedAt > ttl;

export const readBpmCache = (
  artistSlug: string,
  songSlug: string,
): GetSongBpmLookupResult | 'miss' | null => {
  const key = bpmCacheKey(artistSlug, songSlug);
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const ttl = entry.kind === 'hit' ? HIT_TTL_MS : MISS_TTL_MS;
  if (isExpired(entry.cachedAt, ttl)) {
    cache.delete(key);
    return null;
  }

  if (entry.kind === 'miss') {
    return 'miss';
  }

  return {
    ...entry.result,
    source: 'cache',
  };
};

export const writeBpmCache = (artistSlug: string, songSlug: string, result: GetSongBpmLookupResult) => {
  cache.set(bpmCacheKey(artistSlug, songSlug), {
    kind: 'hit',
    result,
    cachedAt: Date.now(),
  });
};

export const writeBpmMissCache = (artistSlug: string, songSlug: string) => {
  cache.set(bpmCacheKey(artistSlug, songSlug), {
    kind: 'miss',
    cachedAt: Date.now(),
  });
};
