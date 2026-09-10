import type { NoteName, ParsedChordSymbol } from './chord-symbol.js';

export const NOTE_TO_PITCH_CLASS: Readonly<Record<NoteName, number>> = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4, F: 5,
  'E#': 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11, Cb: 11,
};

const degreeToInterval = (degree: number): number => {
  const intervals: Record<number, number> = { 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 10, 9: 14, 11: 17, 13: 21 };
  return intervals[degree] ?? 0;
};

export interface ChordFormula {
  pitchClasses: ReadonlySet<number>;
  requiredPitchClasses: ReadonlySet<number>;
  intervals: readonly number[];
  requiredIntervals: readonly number[];
}

export const getChordFormula = (chord: ParsedChordSymbol): ChordFormula => {
  let intervals: number[];
  let required: number[];

  switch (chord.quality) {
    case 'minor': intervals = [0, 3, 7]; required = [0, 3]; break;
    case 'power': intervals = [0, 7]; required = [0, 7]; break;
    case 'diminished': intervals = [0, 3, 6]; required = [0, 3, 6]; break;
    case 'half-diminished': intervals = [0, 3, 6, 10]; required = [0, 3, 6, 10]; break;
    case 'augmented': intervals = [0, 4, 8]; required = [0, 4, 8]; break;
    case 'suspended2': intervals = [0, 2, 7]; required = [0, 2]; break;
    case 'suspended4': intervals = [0, 5, 7]; required = [0, 5]; break;
    default: intervals = [0, 4, 7]; required = [0, 4];
  }

  const isMajorSeventh = chord.normalized.includes('maj7');
  for (const extension of chord.extensions) {
    if (extension === 5) continue;
    if (extension === 6) {
      intervals.push(9); required.push(9); continue;
    }
    if (extension >= 7) {
      const seventh = isMajorSeventh ? 11 : 10;
      intervals.push(seventh);
      required.push(seventh);
      if (extension === 7) continue;
    }
    if (extension >= 9) intervals.push(14);
    if (extension >= 11) intervals.push(17);
    if (extension >= 13) intervals.push(21);
    required.push(degreeToInterval(extension));
  }
  for (const addition of chord.additions) {
    const interval = degreeToInterval(addition);
    intervals.push(interval);
    required.push(interval);
  }
  for (const alteration of chord.alterations) {
    const natural = degreeToInterval(alteration.degree);
    const altered = natural + (alteration.accidental === '#' ? 1 : -1);
    intervals = intervals.filter((value) => value % 12 !== natural % 12);
    required = required.filter((value) => value % 12 !== natural % 12);
    intervals.push(altered);
    required.push(altered);
  }
  for (const omission of chord.omissions) {
    const interval = degreeToInterval(omission);
    intervals = intervals.filter((value) => value % 12 !== interval % 12);
    required = required.filter((value) => value % 12 !== interval % 12);
  }

  const uniqueIntervals = [...new Set(intervals.map((value) => ((value % 12) + 12) % 12))];
  const uniqueRequired = [...new Set(required.map((value) => ((value % 12) + 12) % 12))];
  const root = NOTE_TO_PITCH_CLASS[chord.root];
  return {
    intervals: uniqueIntervals,
    requiredIntervals: uniqueRequired,
    pitchClasses: new Set(uniqueIntervals.map((interval) => (root + interval) % 12)),
    requiredPitchClasses: new Set(uniqueRequired.map((interval) => (root + interval) % 12)),
  };
};
