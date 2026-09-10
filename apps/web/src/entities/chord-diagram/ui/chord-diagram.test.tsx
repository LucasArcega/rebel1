import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ChordFingering } from '@cifra-hub/shared';
import { ChordDiagram } from './chord-diagram';

const fingering: ChordFingering = {
  id: 'test-bm',
  symbol: 'Bm',
  instrument: 'guitar',
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
  frets: ['x', 2, 4, 4, 3, 2],
  fingers: [0, 1, 3, 4, 2, 1],
  baseFret: 2,
  barres: [{ fret: 2, fromString: 5, toString: 1, finger: 1 }],
  difficulty: 3,
  tags: ['barre'],
};

describe('ChordDiagram', () => {
  it('renders muted and pressed strings, a barre and the starting fret', () => {
    const html = renderToStaticMarkup(<ChordDiagram symbol="Bm" fingering={fingering} />);

    expect(html).toContain('role="img"');
    expect(html).toContain('Diagrama de Bm');
    expect(html).toContain('E grave abafada');
    expect(html).toContain('A casa 2');
    expect(html).toContain('chord-diagram__barre');
    expect(html).toContain('chord-diagram__base-fret');
    expect(html).toContain('>×</text>');
  });

  it('announces open strings and renders a highlighted nut', () => {
    const open = { ...fingering, id: 'test-am', symbol: 'Am', baseFret: 1, frets: ['x', 0, 2, 2, 1, 0] } as ChordFingering;
    const html = renderToStaticMarkup(<ChordDiagram symbol="Am" fingering={open} />);

    expect(html).toContain('A solta');
    expect(html).toContain('chord-diagram__nut');
    expect(html).toContain('>○</text>');
  });
});

