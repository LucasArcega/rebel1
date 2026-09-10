import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ChordOccurrence } from '@cifra-hub/shared';
import { uniqueChordOccurrences } from '../lib/unique-chord-occurrences';
import { SongChordStrip } from './song-chord-strip';

const chords: ChordOccurrence[] = [
  { symbol: 'Am', normalizedSymbol: 'Am', order: 0 },
  { symbol: 'C', normalizedSymbol: 'C', order: 1 },
  { symbol: 'Am', normalizedSymbol: 'Am', order: 2 },
];

describe('SongChordStrip', () => {
  it('deduplicates chords while preserving first-occurrence order', () => {
    expect(uniqueChordOccurrences(chords).map((chord) => chord.symbol)).toEqual(['Am', 'C']);
  });

  it('renders cards in order for standard guitar tuning', () => {
    const html = renderToStaticMarkup(<SongChordStrip chords={chords} tuning={null} />);

    expect(html).toContain('Acordes desta música');
    expect(html.indexOf('Diagrama de Am')).toBeLessThan(html.indexOf('Diagrama de C'));
  });

  it('does not leak standard-tuning diagrams into alternate tuning', () => {
    const html = renderToStaticMarkup(<SongChordStrip chords={chords} tuning="Drop D" />);

    expect(html).toContain('Diagramas indisponíveis para esta afinação');
    expect(html).not.toContain('Diagrama de Am');
  });

  it('renders power chords instead of the unavailable state', () => {
    const powerChords: ChordOccurrence[] = [
      { symbol: 'A5', normalizedSymbol: 'A5', order: 0 },
      { symbol: 'C5', normalizedSymbol: 'C5', order: 1 },
      { symbol: 'F#5', normalizedSymbol: 'F#5', order: 2 },
    ];

    const html = renderToStaticMarkup(<SongChordStrip chords={powerChords} tuning={null} />);

    expect(html).toContain('Diagrama de A5');
    expect(html).toContain('Diagrama de C5');
    expect(html).toContain('Diagrama de F#5');
    expect(html).not.toContain('Diagrama indisponível');
  });
});
