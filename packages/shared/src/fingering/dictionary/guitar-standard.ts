import type { ChordFingering, GuitarTuning } from '../types.js';
import { GUITAR_STANDARD_TUNING } from '../types.js';
import { computeBaseFret } from '../base-fret.js';

const tuning: GuitarTuning = GUITAR_STANDARD_TUNING;
const fingering = (
  id: string,
  symbol: string,
  frets: ChordFingering['frets'],
  fingers: ChordFingering['fingers'],
  difficulty: ChordFingering['difficulty'],
  tags: ChordFingering['tags'],
  barres: ChordFingering['barres'] = [],
  omittedIntervals?: readonly number[],
): ChordFingering => ({
  id,
  symbol,
  instrument: 'guitar',
  tuning,
  frets,
  fingers,
  baseFret: computeBaseFret(frets),
  barres,
  difficulty,
  tags,
  omittedIntervals,
});

/** Curated forms whose voicing cannot be represented by the five movable families. */
export const GUITAR_STANDARD_FINGERINGS: readonly ChordFingering[] = [
  fingering('guitar-standard-am-open', 'Am', ['x', 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0], 1, ['open']),
  fingering('guitar-standard-c-open', 'C', ['x', 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0], 1, ['open']),
  fingering('guitar-standard-d-open', 'D', ['x', 'x', 0, 2, 3, 2], [0, 0, 0, 1, 3, 2], 1, ['open']),
  fingering('guitar-standard-e-open', 'E', [0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0], 1, ['open']),
  fingering('guitar-standard-c9-open', 'C9', ['x', 3, 2, 3, 3, 'x'], [0, 2, 1, 3, 4, 0], 3, ['open', 'compact']),
  fingering('guitar-standard-bm11-open', 'Bm11', ['x', 2, 0, 2, 3, 0], [0, 1, 0, 2, 3, 0], 2, ['open'], [], [7]),
  fingering('guitar-standard-d9-f-sharp', 'D9/F#', [2, 0, 0, 2, 1, 0], [2, 0, 0, 3, 1, 0], 2, ['open', 'inversion']),
  fingering('guitar-standard-a-add2-open', 'Aadd2', ['x', 0, 2, 4, 2, 0], [0, 0, 1, 3, 2, 0], 2, ['open', 'compact']),
  fingering('guitar-standard-c6-closed', 'C6', ['x', 3, 2, 2, 5, 'x'], [0, 2, 1, 1, 4, 0], 3, ['compact', 'movable'], [{ fret: 2, fromString: 4, toString: 3, finger: 1 }]),
  fingering('guitar-standard-a-add9-open', 'Aadd9', ['x', 0, 2, 4, 2, 0], [0, 0, 1, 3, 2, 0], 2, ['open', 'compact']),
  fingering('guitar-standard-a-sus2-open', 'Asus2', ['x', 0, 2, 2, 0, 0], [0, 0, 1, 2, 0, 0], 1, ['open']),
  fingering('guitar-standard-cm9-closed', 'Cm9', ['x', 3, 1, 3, 3, 'x'], [0, 3, 1, 4, 4, 0], 4, ['barre', 'compact', 'movable'], [{ fret: 3, fromString: 3, toString: 2, finger: 4 }], [7]),
];
