import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChordContent } from './chord-content';

describe('ChordContent chord previews', () => {
  it('renders a diagram preview for a supported chord token', () => {
    const html = renderToStaticMarkup(<ChordContent content="<b>A5</b>  <b>Cadd9</b>" />);

    expect(html).toContain('Acorde A5. Diagrama e variações disponíveis');
    expect(html).toContain('Acorde Cadd9. Diagrama e variações disponíveis');
    expect(html).toContain('chord-token--previewable');
  });

  it('does not treat a tuning line as playable chord tokens', () => {
    const html = renderToStaticMarkup(<ChordContent content="Afinação: D A D G B E" />);

    expect(html).toContain('Afinação: D A D G B E');
    expect(html).not.toContain('Acorde D. Diagrama disponível');
    expect(html).not.toContain('chord-token__preview');
  });

  it('does not render previews for an alternate tuning or disabled instrument', () => {
    const alternate = renderToStaticMarkup(<ChordContent content="<b>Am</b>" tuning="Drop D" />);
    const disabled = renderToStaticMarkup(<ChordContent content="<b>Am</b>" diagramsEnabled={false} />);

    expect(alternate).not.toContain('chord-token--previewable');
    expect(disabled).not.toContain('chord-token--previewable');
  });
});
