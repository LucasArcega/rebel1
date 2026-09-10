import type { ChordOccurrence } from '@cifra-hub/shared';

export const uniqueChordOccurrences = (chords: readonly ChordOccurrence[]) => {
  const seen = new Set<string>();
  return chords.filter((chord) => {
    const key = chord.normalizedSymbol || chord.symbol;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

