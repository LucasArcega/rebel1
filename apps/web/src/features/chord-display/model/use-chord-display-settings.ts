import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, type Theme } from '@/shared/lib/theme';

const FONT_KEY = 'cifra-hub-font-size';

export type FontSize = 'sm' | 'md' | 'lg';

export const useChordDisplaySettings = () => {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem(FONT_KEY) as FontSize | null) ?? 'md',
  );
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    localStorage.setItem(FONT_KEY, fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const printChord = () => {
    window.print();
  };

  return {
    fontSize,
    setFontSize,
    theme,
    toggleTheme,
    printChord,
  };
};
