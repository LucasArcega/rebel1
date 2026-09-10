import { NOTE_TO_PITCH_CLASS } from '../harmony/chord-formula.js';
import { parseChordSymbol, type ParsedChordSymbol } from '../harmony/chord-symbol.js';
import { computeBaseFret } from './base-fret.js';
import { GUITAR_STANDARD_FINGERINGS } from './dictionary/guitar-standard.js';
import type { Barre, ChordFingering, StringFret } from './types.js';
import { GUITAR_STANDARD_TUNING } from './types.js';
import { validateFingering } from './validate-fingering.js';

type Family = 'major' | 'minor' | 'power' | '7' | 'maj7' | 'm7';

interface Shape {
  name: 'e' | 'a';
  relative: readonly StringFret[];
  openFingers: ChordFingering['fingers'];
  movableFingers: ChordFingering['fingers'];
}

const SHAPES: Record<Family, readonly Shape[]> = {
  major: [
    { name: 'e', relative: [0, 2, 2, 1, 0, 0], openFingers: [0, 2, 3, 1, 0, 0], movableFingers: [1, 3, 4, 2, 1, 1] },
    { name: 'a', relative: ['x', 0, 2, 2, 2, 0], openFingers: [0, 0, 1, 2, 3, 0], movableFingers: [0, 1, 3, 3, 3, 1] },
  ],
  minor: [
    { name: 'e', relative: [0, 2, 2, 0, 0, 0], openFingers: [0, 2, 3, 0, 0, 0], movableFingers: [1, 3, 4, 1, 1, 1] },
    { name: 'a', relative: ['x', 0, 2, 2, 1, 0], openFingers: [0, 0, 2, 3, 1, 0], movableFingers: [0, 1, 3, 4, 2, 1] },
  ],
  power: [
    { name: 'e', relative: [0, 2, 2, 'x', 'x', 'x'], openFingers: [0, 1, 2, 0, 0, 0], movableFingers: [1, 3, 4, 0, 0, 0] },
    { name: 'a', relative: ['x', 0, 2, 2, 'x', 'x'], openFingers: [0, 0, 1, 2, 0, 0], movableFingers: [0, 1, 3, 4, 0, 0] },
  ],
  '7': [
    { name: 'e', relative: [0, 2, 0, 1, 0, 0], openFingers: [0, 2, 0, 1, 0, 0], movableFingers: [1, 3, 1, 2, 1, 1] },
    { name: 'a', relative: ['x', 0, 2, 0, 2, 0], openFingers: [0, 0, 2, 0, 3, 0], movableFingers: [0, 1, 3, 1, 4, 1] },
  ],
  maj7: [
    { name: 'e', relative: [0, 2, 1, 1, 0, 0], openFingers: [0, 3, 1, 2, 0, 0], movableFingers: [1, 4, 2, 3, 1, 1] },
    { name: 'a', relative: ['x', 0, 2, 1, 2, 0], openFingers: [0, 0, 3, 1, 2, 0], movableFingers: [0, 1, 3, 2, 4, 1] },
  ],
  m7: [
    { name: 'e', relative: [0, 2, 0, 0, 0, 0], openFingers: [0, 2, 0, 0, 0, 0], movableFingers: [1, 3, 1, 1, 1, 1] },
    { name: 'a', relative: ['x', 0, 2, 0, 1, 0], openFingers: [0, 0, 2, 0, 1, 0], movableFingers: [0, 1, 3, 1, 2, 1] },
  ],
};

export const isStandardGuitarTuning = (tuning: string | null | undefined): boolean => {
  if (tuning == null || !tuning.trim()) return true;
  const normalized = tuning.toUpperCase().replace(/[^A-G#B]/g, '');
  return normalized === 'EADGBE' || tuning.trim().toLowerCase() === 'standard';
};

const familyOf = (parsed: ParsedChordSymbol): Family | null => {
  if (parsed.bass || parsed.additions.length || parsed.alterations.length || parsed.omissions.length) return null;
  if (parsed.normalized.endsWith('maj7')) return 'maj7';
  if (parsed.quality === 'minor' && parsed.extensions.length === 1 && parsed.extensions[0] === 7) return 'm7';
  if (parsed.quality === 'minor' && parsed.extensions.length === 0) return 'minor';
  if (parsed.quality === 'power' && parsed.extensions.length === 1 && parsed.extensions[0] === 5) return 'power';
  if (parsed.quality === 'major' && parsed.extensions.length === 1 && parsed.extensions[0] === 7) return '7';
  if (parsed.quality === 'major' && parsed.extensions.length === 0) return 'major';
  return null;
};

const rootFret = (pitchClass: number, openPitchClass: number) =>
  (pitchClass - openPitchClass + 12) % 12;

const structureKey = (parsed: ParsedChordSymbol): string => {
  const bassInterval = parsed.bass == null
    ? 'n'
    : String((NOTE_TO_PITCH_CLASS[parsed.bass] - NOTE_TO_PITCH_CLASS[parsed.root] + 12) % 12);
  const alterations = parsed.alterations.map((item) => `${item.accidental}${item.degree}`).join('');
  return [
    parsed.quality,
    parsed.extensions.join(','),
    alterations,
    parsed.additions.join(','),
    parsed.omissions.join(','),
    bassInterval,
  ].join('|');
};

const shiftFinger = (finger: 0 | 1 | 2 | 3 | 4, delta: number): 0 | 1 | 2 | 3 | 4 => {
  if (finger === 0) return 0;
  return Math.min(4, finger + delta) as 1 | 2 | 3 | 4;
};

const shiftFingering = (
  entry: ChordFingering,
  semitones: number,
  symbol: string,
): ChordFingering | null => {
  if (semitones === 0) {
    return {
      ...entry,
      id: entry.symbol === symbol ? entry.id : `${entry.id}:${symbol}`,
      symbol,
    };
  }

  const frets = entry.frets.map((fret) => (fret === 'x' ? 'x' : fret + semitones));
  if (frets.some((fret) => typeof fret === 'number' && (fret < 0 || fret > 18))) return null;

  const hadOpen = entry.frets.some((fret) => fret === 0);
  let fingers = entry.fingers.map((finger) => shiftFinger(finger, hadOpen ? 1 : 0));
  let barres: Barre[] = entry.barres.map((barre) => ({
    ...barre,
    fret: barre.fret + semitones,
    finger: shiftFinger(barre.finger, hadOpen ? 1 : 0) as Barre['finger'],
  }));

  if (hadOpen) {
    const openStringNumbers = entry.frets.flatMap((fret, index) => (fret === 0 ? [6 - index] : []));
    barres = [
      {
        fret: semitones,
        fromString: Math.max(...openStringNumbers),
        toString: Math.min(...openStringNumbers),
        finger: 1,
      },
      ...barres,
    ];
    fingers = entry.fingers.map((finger, index) => {
      if (entry.frets[index] === 'x') return 0;
      if (entry.frets[index] === 0) return 1;
      return shiftFinger(finger, 1);
    });
  }

  return {
    ...entry,
    id: `${entry.id}:t${semitones}:${symbol}`,
    symbol,
    frets,
    fingers,
    barres,
    baseFret: computeBaseFret(frets),
    tags: [...new Set([...entry.tags.filter((tag) => tag !== 'open'), 'movable' as const])],
    difficulty: Math.min(5, entry.difficulty + 1) as ChordFingering['difficulty'],
  };
};

const materialize = (parsed: ParsedChordSymbol, family: Family, shape: Shape): ChordFingering => {
  const pitch = NOTE_TO_PITCH_CLASS[parsed.root];
  const fret = rootFret(pitch, shape.name === 'e' ? 4 : 9);
  const frets = shape.relative.map((value) => (value === 'x' ? value : value + fret));
  const usesBarre = family !== 'power';
  const barres: Barre[] = fret === 0 || !usesBarre
    ? []
    : [{
      fret,
      fromString: shape.name === 'e' ? 6 : 5,
      toString: 1,
      finger: 1,
    }];
  if (fret > 0 && shape.name === 'a' && family === 'major') {
    barres.push({ fret: fret + 2, fromString: 4, toString: 2, finger: 3 });
  }
  return {
    id: `guitar-standard-pc${pitch}-${family}-${shape.name}`,
    symbol: parsed.normalized,
    instrument: 'guitar',
    tuning: GUITAR_STANDARD_TUNING,
    frets,
    fingers: fret === 0 ? shape.openFingers : shape.movableFingers,
    baseFret: computeBaseFret(frets),
    barres,
    difficulty: fret === 0 ? 1 : shape.name === 'e' ? 3 : 4,
    tags: fret === 0 ? ['open'] : usesBarre ? ['barre', 'movable'] : ['movable', 'compact'],
  };
};

const dedupeAndSort = (entries: ChordFingering[]): ChordFingering[] => {
  const seenShapes = new Set<string>();
  const seenIds = new Set<string>();
  return entries
    .filter((entry) => validateFingering(entry).valid)
    .filter((entry) => {
      if (seenIds.has(entry.id)) return false;
      const key = entry.frets.join(',');
      if (seenShapes.has(key)) return false;
      seenIds.add(entry.id);
      seenShapes.add(key);
      return true;
    })
    .sort((a, b) =>
      Number(!a.tags.includes('open')) - Number(!b.tags.includes('open')) ||
      a.difficulty - b.difficulty ||
      a.baseFret - b.baseFret ||
      a.id.localeCompare(b.id),
    );
};

export const findFingerings = (symbol: string, tuning?: string | null): ChordFingering[] => {
  if (!isStandardGuitarTuning(tuning)) return [];
  const parsed = parseChordSymbol(symbol);
  if (!parsed) return [];

  const exact = GUITAR_STANDARD_FINGERINGS
    .filter((entry) => parseChordSymbol(entry.symbol)?.normalized === parsed.normalized)
    .map((entry) => ({ ...entry, symbol: parsed.normalized }));

  const family = familyOf(parsed);
  const generated = family
    ? SHAPES[family].map((shape) => materialize(parsed, family, shape))
    : [];

  const shifted = family
    ? []
    : GUITAR_STANDARD_FINGERINGS.flatMap((entry) => {
      const source = parseChordSymbol(entry.symbol);
      if (!source || structureKey(source) !== structureKey(parsed)) return [];
      const semitones = (NOTE_TO_PITCH_CLASS[parsed.root] - NOTE_TO_PITCH_CLASS[source.root] + 12) % 12;
      const next = shiftFingering(entry, semitones, parsed.normalized);
      return next ? [next] : [];
    });

  return dedupeAndSort([...exact, ...shifted, ...generated]);
};
