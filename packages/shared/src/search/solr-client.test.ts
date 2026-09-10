import { afterEach, describe, expect, it, vi } from 'vitest';
import { findBassVersionId } from './solr-client.js';

afterEach(() => vi.unstubAllGlobals());

describe('findBassVersionId', () => {
  it('returns the exact indexed bass version', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      response: {
        docs: [{ t: '2', dns: 'avenged-sevenfold', url: 'dear-god', icbx: 32276 }],
      },
    })));
    vi.stubGlobal('fetch', fetchMock);

    await expect(findBassVersionId('avenged-sevenfold', 'dear-god')).resolves.toBe(32276);
    const requestUrl = new URL(fetchMock.mock.calls[0][0]);
    expect(requestUrl.searchParams.get('q')).toBe('dns:"avenged-sevenfold" AND url:"dear-god"');
    expect(requestUrl.searchParams.get('fl')).toContain('icbx');
  });

  it('returns null when the exact song has no bass version', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      response: {
        docs: [{ t: '2', dns: 'chitaozinho-e-xororo', url: 'evidencias', icbx: 0 }],
      },
    }))));

    await expect(findBassVersionId('chitaozinho-e-xororo', 'evidencias')).resolves.toBeNull();
  });
});
