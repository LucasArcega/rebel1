const STORAGE_KEY = 'cifra-hub-search-history';
const MAX_ITEMS = 8;

export const searchHistoryStorage = {
  list: (): string[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  },

  add: (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    const next = [trimmed, ...searchHistoryStorage.list().filter((item) => item !== trimmed)].slice(
      0,
      MAX_ITEMS,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  },

  clear: () => localStorage.removeItem(STORAGE_KEY),
};
