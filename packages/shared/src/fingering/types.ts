export type StringFret = number | 'x';
export type FingeringTag = 'open' | 'barre' | 'movable' | 'inversion' | 'compact';
export type GuitarTuning = readonly ['E', 'A', 'D', 'G', 'B', 'E'];

export interface Barre {
  fret: number;
  /** Conventional string number: 6 is the lowest string, 1 the highest. */
  fromString: number;
  toString: number;
  finger: 1 | 2 | 3 | 4;
}

export interface ChordFingering {
  id: string;
  symbol: string;
  instrument: 'guitar';
  tuning: GuitarTuning;
  /** Absolute frets, ordered from the sixth string to the first. */
  frets: readonly StringFret[];
  fingers: readonly (0 | 1 | 2 | 3 | 4)[];
  baseFret: number;
  barres: readonly Barre[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: readonly FingeringTag[];
  omittedIntervals?: readonly number[];
}

export interface FingeringValidation {
  valid: boolean;
  errors: readonly string[];
  pitchClasses: readonly number[];
}

export const GUITAR_STANDARD_TUNING: GuitarTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
