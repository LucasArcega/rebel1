import { fingeringPreferenceStorageKey, type ChordFingering } from '@cifra-hub/shared';

const preferenceKey = (normalizedSymbol: string) => fingeringPreferenceStorageKey(normalizedSymbol);

const getStorage = (): Storage | null => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
};

export const readFingeringPreference = (
  normalizedSymbol: string,
  fingerings: readonly ChordFingering[],
): string | null => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const id = storage.getItem(preferenceKey(normalizedSymbol));
    if (!id) return null;
    if (fingerings.some((fingering) => fingering.id === id)) return id;
    storage.removeItem(preferenceKey(normalizedSymbol));
  } catch {
    // Storage may be unavailable in privacy modes or when its quota is exhausted.
  }
  return null;
};

export const saveFingeringPreference = (normalizedSymbol: string, fingeringId: string) => {
  try {
    getStorage()?.setItem(preferenceKey(normalizedSymbol), fingeringId);
  } catch {
    // The selection still works for this render even when persistence is unavailable.
  }
};

