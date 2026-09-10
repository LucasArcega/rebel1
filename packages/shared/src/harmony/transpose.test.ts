import { describe, expect, it } from 'vitest';
import { transposeChord, transposeChordOccurrences } from './transpose.js';

describe('transposeChord', () => {
  it('preserves extensions and slash bass', () => {
    expect(transposeChord('D9/F#', 2)).toBe('E9/G#');
    expect(transposeChord('Cmaj7', 2)).toBe('Dmaj7');
    expect(transposeChord('Bb', 1)).toBe('B');
    expect(transposeChord('F#m', -2)).toBe('Em');
  });
});

describe('transposeChordOccurrences', () => {
  it('transposes symbols without changing order', () => {
    const transposed = transposeChordOccurrences([
      { symbol: 'Am', normalizedSymbol: 'Am', order: 0 },
      { symbol: 'D9/F#', normalizedSymbol: 'D9/F#', order: 1 },
    ], 2);

    expect(transposed.map((chord) => chord.symbol)).toEqual(['Bm', 'E9/G#']);
    expect(transposed.map((chord) => chord.order)).toEqual([0, 1]);
  });
});
