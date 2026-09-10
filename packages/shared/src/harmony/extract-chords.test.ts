import { describe, expect, it } from 'vitest';
import { extractChordOccurrences } from './extract-chords.js';

describe('extractChordOccurrences', () => {
  it('captures unique bold chords in first-occurrence order', () => {
    const content = [
      '[Intro]',
      '<b>Am</b>  <b>Bm11</b>  <b>C</b>  <b>C9</b>',
      '<b>D</b>  <b>D9/F#</b>  <b>E</b>',
      '<b>Am</b>  <b>C</b>',
    ].join('\n');

    expect(extractChordOccurrences(content).map((chord) => chord.symbol)).toEqual([
      'Am', 'Bm11', 'C', 'C9', 'D', 'D9/F#', 'E',
    ]);
    expect(extractChordOccurrences(content).map((chord) => chord.order)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('falls back to legacy chord rows and ignores lyric words', () => {
    const content = [
      '[Intro]',
      'Am  C  D9/F#  E',
      'A vida corre e ganha novos caminhos',
      'Come up to meet you',
    ].join('\n');

    expect(extractChordOccurrences(content).map((chord) => chord.symbol)).toEqual(['Am', 'C', 'D9/F#', 'E']);
  });

  it('does not treat section headers or tablature as chords', () => {
    const content = [
      '[Refrão]',
      'E|----------|',
      'A|----------|',
    ].join('\n');

    expect(extractChordOccurrences(content)).toEqual([]);
  });

  it('keeps power chords in semantic and legacy chord rows', () => {
    expect(extractChordOccurrences('<b>A5</b> <b>C5</b> <b>G5</b>').map((chord) => chord.symbol))
      .toEqual(['A5', 'C5', 'G5']);
    expect(extractChordOccurrences('A5  C5  G5').map((chord) => chord.symbol))
      .toEqual(['A5', 'C5', 'G5']);
  });
});
