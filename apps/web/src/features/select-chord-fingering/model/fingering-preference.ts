import { fingeringPreferenceStorageKey, type ChordFingering } from '@cifra-hub/shared';

const preferenceKey = (normalizedSymbol: string) => fingeringPreferenceStorageKey(normalizedSymbol);
const PREFERENCE_EVENT = 'cifra-hub:fingering-preference';

interface FingeringPreferenceEventDetail {
  key: string;
}

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
  const key = preferenceKey(normalizedSymbol);
  try {
    getStorage()?.setItem(key, fingeringId);
  } catch {
    // The selection still works for this render even when persistence is unavailable.
  }

  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent<FingeringPreferenceEventDetail>(PREFERENCE_EVENT, {
      detail: { key },
    }));
  }
};

export const subscribeFingeringPreference = (
  normalizedSymbol: string,
  listener: () => void,
) => {
  if (typeof window === 'undefined') return () => undefined;

  const key = preferenceKey(normalizedSymbol);
  const onPreference = (event: Event) => {
    const detail = (event as CustomEvent<FingeringPreferenceEventDetail>).detail;
    if (detail?.key === key) listener();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) listener();
  };

  window.addEventListener(PREFERENCE_EVENT, onPreference);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(PREFERENCE_EVENT, onPreference);
    window.removeEventListener('storage', onStorage);
  };
};
