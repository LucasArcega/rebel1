import type { StringFret } from './types.js';

/** Visual window start. Absolute frets stay unchanged. */
export const computeBaseFret = (frets: readonly StringFret[]): number => {
  const pressed = frets.filter((fret): fret is number => fret !== 'x' && fret > 0);
  if (!pressed.length) return 1;

  const hasOpen = frets.some((fret) => fret === 0);
  const minPressed = Math.min(...pressed);
  return hasOpen || minPressed <= 1 ? 1 : minPressed;
};
