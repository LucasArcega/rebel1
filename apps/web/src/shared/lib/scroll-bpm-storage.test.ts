import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  loadScrollBpmPrefs,
  resolveInitialScrollBpm,
  saveScrollBpmPrefs,
  shouldFetchRemoteBpm,
} from './scroll-bpm-storage';

const createStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
  } satisfies Storage;
};

afterEach(() => vi.unstubAllGlobals());

describe('scroll-bpm-storage', () => {
  it('restores manual preferences and skips remote fetch', () => {
    const localStorage = createStorage();
    vi.stubGlobal('window', { localStorage });

    saveScrollBpmPrefs('ac-dc', 'highway-to-hell', {
      bpm: 90,
      linesPerBeat: 1.5,
      bpmSource: 'manual',
    });

    expect(loadScrollBpmPrefs('ac-dc', 'highway-to-hell')).toMatchObject({
      bpm: 90,
      linesPerBeat: 1.5,
      bpmSource: 'manual',
    });
    expect(shouldFetchRemoteBpm('ac-dc', 'highway-to-hell')).toBe(false);
    expect(resolveInitialScrollBpm('ac-dc', 'highway-to-hell').bpm).toBe(90);
  });

  it('uses a fresh GetSong cache without refetching', () => {
    const localStorage = createStorage();
    vi.stubGlobal('window', { localStorage });

    saveScrollBpmPrefs('coldplay', 'the-scientist', {
      bpm: 74,
      linesPerBeat: 1,
      bpmSource: 'getsong',
      cachedGetSong: { bpm: 74, fetchedAt: Date.now() },
    });

    expect(shouldFetchRemoteBpm('coldplay', 'the-scientist')).toBe(false);
    expect(resolveInitialScrollBpm('coldplay', 'the-scientist')).toMatchObject({
      bpm: 74,
      bpmSource: 'getsong',
    });
  });

  it('does not throw when browser storage is blocked', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage {
        throw new Error('blocked');
      },
    });

    expect(() => saveScrollBpmPrefs('a', 'b', { bpm: 120, linesPerBeat: 1, bpmSource: 'manual' })).not.toThrow();
    expect(loadScrollBpmPrefs('a', 'b')).toBeNull();
    expect(shouldFetchRemoteBpm('a', 'b')).toBe(true);
  });
});
