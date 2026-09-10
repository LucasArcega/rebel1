import { describe, expect, it } from 'vitest';
import { NOTE_TO_PITCH_CLASS } from '../harmony/chord-formula.js';
import { GUITAR_STANDARD_FINGERINGS } from './dictionary/guitar-standard.js';
import { findFingerings, isStandardGuitarTuning } from './find-fingerings.js';
import { validateFingering } from './validate-fingering.js';

const OPEN_STRING_PITCHES = [40, 45, 50, 55, 59, 64] as const;

describe('guitar fingering dictionary', () => {
  it('keeps six strings and unique ids on every curated entry', () => {
    const ids = GUITAR_STANDARD_FINGERINGS.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const entry of GUITAR_STANDARD_FINGERINGS) {
      expect(entry.frets).toHaveLength(6);
      expect(entry.fingers).toHaveLength(6);
      const result = validateFingering(entry);
      expect(result.errors, result.errors.join('; ')).toEqual([]);
      expect(result.valid).toBe(true);
    }
  });

  it('keeps F# as the lowest sounding note of D9/F#', () => {
    const fingering = findFingerings('D9/F#')[0];
    expect(fingering).toBeTruthy();
    const sounded = fingering.frets.flatMap((fret, index) =>
      fret === 'x' ? [] : [OPEN_STRING_PITCHES[index] + fret],
    );
    expect(Math.min(...sounded) % 12).toBe(NOTE_TO_PITCH_CLASS['F#']);
  });

  it('covers the visual reference chords and family variants', () => {
    for (const symbol of ['Am', 'Bm11', 'C', 'C9', 'D', 'D9/F#', 'E']) {
      expect(findFingerings(symbol).length, symbol).toBeGreaterThan(0);
    }
    for (const symbol of ['C', 'Am', 'G7', 'Cmaj7', 'Em7', 'D7M']) {
      expect(findFingerings(symbol).length, symbol).toBeGreaterThanOrEqual(2);
    }
  });

  it('materializes power-chord shapes rooted on the sixth and fifth strings', () => {
    for (const symbol of ['A5', 'C5', 'F#5']) {
      const shapes = findFingerings(symbol);
      expect(shapes.length, symbol).toBeGreaterThanOrEqual(2);
      expect(shapes.every((shape) => validateFingering(shape).valid), symbol).toBe(true);
      expect(shapes.every((shape) => !shape.tags.includes('barre')), symbol).toBe(true);
    }
  });

  it('covers add2, 6, 9, add9, sus2 and m9 families across roots', () => {
    for (const symbol of ['C2', 'Dadd2', 'C6', 'F6', 'C9', 'G9', 'Cadd9', 'Dadd9', 'Csus2', 'Dsus2', 'Cm9', 'Dm9']) {
      const shapes = findFingerings(symbol);
      expect(shapes.length, symbol).toBeGreaterThan(0);
      expect(shapes.every((shape) => validateFingering(shape).valid), symbol).toBe(true);
    }
  });

  it('sorts variations deterministically and transposes curated extended shapes', () => {
    const first = findFingerings('C').map((entry) => entry.id);
    const second = findFingerings('C').map((entry) => entry.id);
    expect(first).toEqual(second);

    const transposed = findFingerings('E9/G#');
    expect(transposed.length).toBeGreaterThan(0);
    const sounded = transposed[0].frets.flatMap((fret, index) =>
      fret === 'x' ? [] : [OPEN_STRING_PITCHES[index] + fret],
    );
    expect(Math.min(...sounded) % 12).toBe(NOTE_TO_PITCH_CLASS['G#']);
  });

  it('returns no standard-tuning shapes for an explicit alternate tuning', () => {
    expect(isStandardGuitarTuning(null)).toBe(true);
    expect(isStandardGuitarTuning('E A D G B E')).toBe(true);
    expect(findFingerings('Am', 'D A D G A D')).toEqual([]);
  });
});
