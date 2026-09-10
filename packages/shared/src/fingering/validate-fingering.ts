import { getChordFormula, NOTE_TO_PITCH_CLASS } from '../harmony/chord-formula.js';
import { parseChordSymbol } from '../harmony/chord-symbol.js';
import type { ChordFingering, FingeringValidation } from './types.js';

const OPEN_STRING_PITCHES = [40, 45, 50, 55, 59, 64] as const;
const stringToIndex = (string: number) => 6 - string;

export const validateFingering = (fingering: ChordFingering): FingeringValidation => {
  const errors: string[] = [];
  if (fingering.frets.length !== 6) errors.push('frets must contain six strings');
  if (fingering.fingers.length !== 6) errors.push('fingers must contain six strings');
  if (!Number.isInteger(fingering.baseFret) || fingering.baseFret < 1) errors.push('baseFret must be positive');

  for (let index = 0; index < Math.min(fingering.frets.length, fingering.fingers.length); index += 1) {
    const fret = fingering.frets[index];
    const finger = fingering.fingers[index];
    if (fret === 'x' || fret === 0) {
      if (finger !== 0) errors.push(`string ${6 - index}: muted/open strings require finger 0`);
    } else if (!Number.isInteger(fret) || fret < 1) {
      errors.push(`string ${6 - index}: fret must be a positive integer`);
    } else if (finger === 0) {
      errors.push(`string ${6 - index}: fretted strings require a finger`);
    }
  }

  for (const barre of fingering.barres) {
    if (barre.fromString < barre.toString || barre.fromString > 6 || barre.toString < 1) {
      errors.push('barre string range is invalid');
      continue;
    }
    for (let string = barre.fromString; string >= barre.toString; string -= 1) {
      const index = stringToIndex(string);
      const fret = fingering.frets[index];
      if (fret !== 'x' && typeof fret === 'number' && fret < barre.fret) {
        errors.push(`barre at fret ${barre.fret} conflicts with string ${string}`);
      }
    }
  }

  const parsed = parseChordSymbol(fingering.symbol);
  const sounded = fingering.frets.flatMap((fret, index) =>
    fret === 'x' ? [] : [OPEN_STRING_PITCHES[index] + fret],
  );
  const pitchClasses = [...new Set(sounded.map((pitch) => pitch % 12))].sort((a, b) => a - b);
  if (!parsed) {
    errors.push('symbol is invalid');
  } else {
    const formula = getChordFormula(parsed);
    for (const pitchClass of pitchClasses) {
      if (!formula.pitchClasses.has(pitchClass)) errors.push(`pitch class ${pitchClass} is outside the chord formula`);
    }
    const rootPc = NOTE_TO_PITCH_CLASS[parsed.root];
    const omitted = new Set((fingering.omittedIntervals ?? []).map((interval) => (rootPc + interval) % 12));
    for (const pitchClass of formula.requiredPitchClasses) {
      if (!pitchClasses.includes(pitchClass) && !omitted.has(pitchClass)) {
        errors.push(`required pitch class ${pitchClass} is missing`);
      }
    }
    if (parsed.bass && sounded.length) {
      const lowest = Math.min(...sounded) % 12;
      if (lowest !== NOTE_TO_PITCH_CLASS[parsed.bass]) errors.push('lowest note does not match slash bass');
    }
  }

  return { valid: errors.length === 0, errors, pitchClasses };
};
