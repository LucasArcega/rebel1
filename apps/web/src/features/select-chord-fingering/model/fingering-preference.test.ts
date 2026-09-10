import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ChordFingering } from '@cifra-hub/shared';
import { readFingeringPreference, saveFingeringPreference } from './fingering-preference';

const fingering = { id: 'am-open' } as ChordFingering;

const createStorage = () => {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  } satisfies Storage;
};

afterEach(() => vi.unstubAllGlobals());

describe('fingering preference', () => {
  it('restores a valid local preference', () => {
    const localStorage = createStorage();
    vi.stubGlobal('window', { localStorage });

    saveFingeringPreference('Am', 'am-open');
    expect(readFingeringPreference('Am', [fingering])).toBe('am-open');
  });

  it('removes a stale preference and falls back safely', () => {
    const localStorage = createStorage();
    vi.stubGlobal('window', { localStorage });
    localStorage.setItem('chord-fingering/guitar/E-A-D-G-B-E/Am', 'removed-id');

    expect(readFingeringPreference('Am', [fingering])).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('does not throw when browser storage is blocked', () => {
    vi.stubGlobal('window', {
      get localStorage(): Storage { throw new Error('blocked'); },
    });

    expect(() => saveFingeringPreference('Am', 'am-open')).not.toThrow();
    expect(readFingeringPreference('Am', [fingering])).toBeNull();
  });
});

