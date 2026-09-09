export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'cifra-hub-theme';

export const getStoredTheme = (): Theme => {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' ? 'light' : 'dark';
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
};

export const initTheme = () => {
  applyTheme(getStoredTheme());
};
