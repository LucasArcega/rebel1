import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseGetSongSearchPayload, pickBestGetSongMatch, searchGetSongBpm } from './getsongbpm-client.js';
import { normalizeSearchText, scoreNameMatch } from './normalize-search.js';

afterEach(() => vi.unstubAllGlobals());

const highwayHit = {
  id: '983pB',
  title: 'Highway to Hell',
  artistName: 'AC/DC',
  tempo: 116,
};

describe('normalize-search', () => {
  it('strips accents and punctuation for matching', () => {
    expect(normalizeSearchText('Legião Urbana')).toBe('legiao urbana');
    expect(normalizeSearchText('AC/DC')).toBe('ac dc');
  });

  it('scores exact and partial names', () => {
    expect(scoreNameMatch('AC/DC', 'AC/DC')).toBe(3);
    expect(scoreNameMatch('Highway to Hell', 'highway-to-hell')).toBe(3);
    expect(scoreNameMatch('Coldplay', 'cold')).toBe(2);
  });
});

describe('parseGetSongSearchPayload', () => {
  it('normalizes type=both fields', () => {
    const hits = parseGetSongSearchPayload({
      search: [
        {
          song_id: '983pB',
          song_title: 'Highway to Hell',
          tempo: '116',
          time_sig: '4/4',
          key_of: 'A',
          artist: { name: 'AC/DC', id: 'xyz' },
        },
      ],
    });

    expect(hits).toEqual([
      {
        id: '983pB',
        title: 'Highway to Hell',
        artistName: 'AC/DC',
        tempo: 116,
        timeSig: '4/4',
        key: 'A',
      },
    ]);
  });

  it('normalizes type=song fields and ignores out-of-range tempo', () => {
    const hits = parseGetSongSearchPayload({
      search: [
        { id: 'ok', title: 'Lonely Day', tempo: 90, artist: { name: 'System Of A Down' } },
        { id: 'fast', title: 'Too Fast', tempo: 400, artist: { name: 'System Of A Down' } },
      ],
    });

    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatchObject({ id: 'ok', tempo: 90 });
  });

  it('treats a search error object as no hits', () => {
    expect(parseGetSongSearchPayload({ search: { error: 'Song not found' } })).toEqual([]);
  });
});

describe('pickBestGetSongMatch', () => {
  it('prefers the closest artist and title', () => {
    const match = pickBestGetSongMatch(
      [
        { ...highwayHit, id: 'other', title: 'Hell\'s Bells', tempo: 110 },
        highwayHit,
      ],
      'AC/DC',
      'Highway to Hell',
    );

    expect(match?.id).toBe('983pB');
    expect(match?.tempo).toBe(116);
  });

  it('returns null when artist or title do not match', () => {
    expect(pickBestGetSongMatch([highwayHit], 'Coldplay', 'The Scientist')).toBeNull();
    expect(pickBestGetSongMatch([highwayHit], 'AC/DC', 'Back in Black')).toBeNull();
  });
});

describe('searchGetSongBpm', () => {
  it('uses the official both-query lookup and falls back to type=song', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ search: { error: 'empty' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        search: [
          { id: '983pB', title: 'Highway to Hell', tempo: 116, artist: { name: 'AC/DC' } },
        ],
      }), { status: 200 }));

    const hits = await searchGetSongBpm({
      apiKey: 'test-key',
      artistName: 'AC/DC',
      songName: 'Highway to Hell',
      fetchFn: fetchMock as unknown as typeof fetch,
    });

    expect(hits).toHaveLength(1);
    const firstUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(firstUrl.searchParams.get('type')).toBe('both');
    expect(firstUrl.searchParams.get('lookup')).toBe('song:Highway to Hell artist:AC/DC');
    expect(fetchMock.mock.calls[0]?.[1]?.headers['X-API-KEY']).toBe('test-key');
    expect(fetchMock.mock.calls[0]?.[1]?.headers['User-Agent']).toContain('CifraHub');
    expect(new URL(String(fetchMock.mock.calls[1]?.[0])).searchParams.get('type')).toBe('song');
  });
});
