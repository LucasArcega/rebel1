import {
  DEFAULT_BPM,
  DEFAULT_LINES_PER_BEAT,
  clampBpm,
  clampLinesPerBeat,
  type BpmSource,
} from '@cifra-hub/shared';

const STORAGE_PREFIX = 'scroll-bpm';
const GETSONG_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface CachedGetSongBpm {
  bpm: number;
  key?: string;
  fetchedAt: number;
}

export interface ScrollBpmPrefs {
  bpm: number;
  linesPerBeat: number;
  bpmSource: BpmSource;
  cachedGetSong?: CachedGetSongBpm;
}

export interface ResolvedScrollBpmPrefs {
  bpm: number;
  linesPerBeat: number;
  bpmSource: BpmSource | null;
  cachedGetSong?: CachedGetSongBpm;
}

export const scrollBpmStorageKey = (artistSlug: string, songSlug: string) =>
  `${STORAGE_PREFIX}/${artistSlug}/${songSlug}`;

const isBpmSource = (value: unknown): value is BpmSource =>
  value === 'getsong' || value === 'tap' || value === 'manual';

export const isFreshGetSongCache = (cache: CachedGetSongBpm | undefined): cache is CachedGetSongBpm => {
  if (!cache || !Number.isFinite(cache.bpm) || !Number.isFinite(cache.fetchedAt)) {
    return false;
  }

  return Date.now() - cache.fetchedAt <= GETSONG_CACHE_TTL_MS;
};

const parsePrefs = (raw: string | null): ScrollBpmPrefs | null => {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ScrollBpmPrefs>;
    if (!isBpmSource(parsed.bpmSource) || typeof parsed.bpm !== 'number') {
      return null;
    }

    return {
      bpm: clampBpm(parsed.bpm),
      linesPerBeat: clampLinesPerBeat(typeof parsed.linesPerBeat === 'number' ? parsed.linesPerBeat : DEFAULT_LINES_PER_BEAT),
      bpmSource: parsed.bpmSource,
      cachedGetSong: parsed.cachedGetSong && typeof parsed.cachedGetSong.bpm === 'number'
        ? {
            bpm: clampBpm(parsed.cachedGetSong.bpm),
            key: parsed.cachedGetSong.key,
            fetchedAt: parsed.cachedGetSong.fetchedAt,
          }
        : undefined,
    };
  } catch {
    return null;
  }
};

const readStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const loadScrollBpmPrefs = (artistSlug: string, songSlug: string): ScrollBpmPrefs | null => {
  const storage = readStorage();
  if (!storage) {
    return null;
  }

  return parsePrefs(storage.getItem(scrollBpmStorageKey(artistSlug, songSlug)));
};

export const saveScrollBpmPrefs = (artistSlug: string, songSlug: string, prefs: ScrollBpmPrefs) => {
  const storage = readStorage();
  if (!storage) {
    return;
  }

  try {
    storage.setItem(scrollBpmStorageKey(artistSlug, songSlug), JSON.stringify(prefs));
  } catch {
    // Storage can be blocked or full; scrolling still works in-memory.
  }
};

export const resolveInitialScrollBpm = (artistSlug: string, songSlug: string): ResolvedScrollBpmPrefs => {
  const prefs = loadScrollBpmPrefs(artistSlug, songSlug);
  if (!prefs) {
    return {
      bpm: DEFAULT_BPM,
      linesPerBeat: DEFAULT_LINES_PER_BEAT,
      bpmSource: null,
    };
  }

  if (prefs.bpmSource === 'manual' || prefs.bpmSource === 'tap') {
    return prefs;
  }

  if (isFreshGetSongCache(prefs.cachedGetSong)) {
    return {
      bpm: prefs.cachedGetSong.bpm,
      linesPerBeat: prefs.linesPerBeat,
      bpmSource: 'getsong',
      cachedGetSong: prefs.cachedGetSong,
    };
  }

  return {
    bpm: DEFAULT_BPM,
    linesPerBeat: prefs.linesPerBeat,
    bpmSource: null,
    cachedGetSong: prefs.cachedGetSong,
  };
};

export const shouldFetchRemoteBpm = (artistSlug: string, songSlug: string): boolean => {
  const prefs = loadScrollBpmPrefs(artistSlug, songSlug);
  if (!prefs) {
    return true;
  }

  if (prefs.bpmSource === 'manual' || prefs.bpmSource === 'tap') {
    return false;
  }

  return !isFreshGetSongCache(prefs.cachedGetSong);
};
