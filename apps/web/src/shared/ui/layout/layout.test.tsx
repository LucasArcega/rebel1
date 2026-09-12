import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppShell, Inline, Stack, Surface } from './index';

describe('layouts', () => {
  it('render semantic slots without domain coupling', () => {
    const html = renderToStaticMarkup(
      <AppShell header={<span>Header</span>} sidebar={<span>Sidebar</span>}>
        <Stack gap={2}>
          <Inline>
            <Surface tone="raised">Card</Surface>
          </Inline>
        </Stack>
      </AppShell>,
    );

    expect(html).toContain('data-slot="app-shell"');
    expect(html).toContain('data-slot="app-shell-header"');
    expect(html).toContain('data-slot="app-shell-sidebar"');
    expect(html).toContain('data-slot="stack"');
    expect(html).toContain('data-slot="inline"');
    expect(html).toContain('data-slot="surface"');
    expect(html).not.toContain('chord-token');
  });
});
