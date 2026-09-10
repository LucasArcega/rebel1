import { describe, expect, it } from 'vitest';
import { parseChordSymbol } from './chord-symbol.js';

describe('parseChordSymbol', () => {
  it('normalizes the short 2 notation as add2', () => {
    expect(parseChordSymbol('C2')?.normalized).toBe('Cadd2');
    expect(parseChordSymbol('C2')?.additions).toEqual([2]);
  });

  it('parses common qualities and suffixes', () => {
    expect(parseChordSymbol('Am')).toMatchObject({ root: 'A', quality: 'minor', normalized: 'Am' });
    expect(parseChordSymbol('Bb')).toMatchObject({ root: 'Bb', quality: 'major', normalized: 'Bb' });
    expect(parseChordSymbol('F#m')).toMatchObject({ root: 'F#', quality: 'minor', normalized: 'F#m' });
    expect(parseChordSymbol('Cmaj7')).toMatchObject({ root: 'C', quality: 'major', extensions: [7], normalized: 'Cmaj7' });
    expect(parseChordSymbol('G7')).toMatchObject({ root: 'G', quality: 'major', extensions: [7], normalized: 'G7' });
    expect(parseChordSymbol('Csus4')).toMatchObject({ root: 'C', quality: 'suspended4', normalized: 'Csus4' });
    expect(parseChordSymbol('Cadd9')).toMatchObject({ root: 'C', additions: [9], normalized: 'Cadd9' });
  });

  it('parses extensions, inversions and parenthetical alterations', () => {
    expect(parseChordSymbol('C9')).toMatchObject({ root: 'C', extensions: [9], bass: null, normalized: 'C9' });
    expect(parseChordSymbol('Bm11')).toMatchObject({ root: 'B', quality: 'minor', extensions: [11], normalized: 'Bm11' });
    expect(parseChordSymbol('D9/F#')).toMatchObject({ root: 'D', extensions: [9], bass: 'F#', normalized: 'D9/F#' });
    expect(parseChordSymbol('C7(b9)')).toMatchObject({
      root: 'C',
      extensions: [7],
      alterations: [{ accidental: 'b', degree: 9 }],
      normalized: 'C7b9',
    });
    expect(parseChordSymbol('D7M')).toMatchObject({ root: 'D', extensions: [7], normalized: 'Dmaj7' });
    expect(parseChordSymbol('B2')).toMatchObject({ root: 'B', additions: [2], normalized: 'Badd2' });
    expect(parseChordSymbol('G2')).toMatchObject({ root: 'G', additions: [2], normalized: 'Gadd2' });
  });

  it('normalizes aliases to a stable key without changing raw spelling', () => {
    expect(parseChordSymbol('Fmin')?.normalized).toBe(parseChordSymbol('Fm')?.normalized);
    expect(parseChordSymbol('CM7')?.normalized).toBe(parseChordSymbol('Cmaj7')?.normalized);
    expect(parseChordSymbol('Cmin7')?.normalized).toBe(parseChordSymbol('Cm7')?.normalized);
    expect(parseChordSymbol('CM7')?.raw).toBe('CM7');
    expect(parseChordSymbol('D7M')?.normalized).toBe(parseChordSymbol('Dmaj7')?.normalized);
  });

  it('returns null for incomplete or non-chord input without throwing', () => {
    expect(parseChordSymbol('')).toBeNull();
    expect(parseChordSymbol('H7')).toBeNull();
    expect(parseChordSymbol('Am C')).toBeNull();
    expect(parseChordSymbol('C/')).toBeNull();
    expect(parseChordSymbol('C7(')).toBeNull();
    expect(parseChordSymbol('[Intro]')).toBeNull();
    expect(parseChordSymbol('vida')).toBeNull();
    expect(parseChordSymbol('A#b')).toBeNull();
    expect(() => parseChordSymbol('not-a-chord')).not.toThrow();
  });
});
