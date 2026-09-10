import { describe, expect, it } from 'vitest';
import { buildFetchUrl, buildVersionPath, parseCifraClubHtml } from './parser.js';

const BASE = 'https://www.cifraclub.com.br';

const wrapChunk = (content: string) =>
  `<script>self.__next_f.push([1,${JSON.stringify(content)}])</script>`;

const CHORD_HTML = [
  wrapChunk('[Primeira Parte]\\n\\n<b>Dm7</b>             <b>Bb9</b>\\n    Come up to meet you'),
  wrapChunk(
    '{"songData":{"priorityVersions":[{"id":1,"instrument":{"slug":"cifra-group","name":"Violão"},"label":{"name":"Principal","slug":"principal"}}],"artist":{"name":"Coldplay"},"song":{"name":"The Scientist"},"id":1351255,"status":0,"tone":"Dm","composers":["Coldplay"]}}',
  ),
].join('');

const LYRICS_HTML = [
  wrapChunk(
    '{"initialSong":{"id":1,"status":0,"content":"Come up to meet you, tell you I\'m sorry\\nYou don\'t know how lovely you are"}}',
  ),
  wrapChunk(
    '{"songData":{"priorityVersions":[],"artist":{"name":"Coldplay"},"song":{"name":"The Scientist"},"id":1,"status":0}}',
  ),
].join('');

const BASS_HTML = [
  wrapChunk('Intro\nG|---------9~~|\nD|-7~~-10r--------|'),
  wrapChunk(
    '{"songData":{"priorityVersions":[],"artist":{"name":"A7X"},"song":{"name":"Buried Alive"},"id":1,"status":0}}',
  ),
].join('');

describe('buildVersionPath', () => {
  it('builds principal and simplificada paths', () => {
    expect(buildVersionPath('coldplay', 'the-scientist', 'cifra-group', 'principal')).toBe(
      '/coldplay/the-scientist/',
    );
    expect(buildVersionPath('coldplay', 'the-scientist', 'cifra-group', 'simplificada')).toBe(
      '/coldplay/the-scientist/simplificada/',
    );
  });

  it('builds instrument paths', () => {
    expect(buildFetchUrl(BASE, 'coldplay', 'the-scientist', 'lyrics')).toBe(
      `${BASE}/coldplay/the-scientist/letra/`,
    );
    expect(buildFetchUrl(BASE, 'coldplay', 'the-scientist', 'keyboard')).toBe(
      `${BASE}/coldplay/the-scientist/teclado/`,
    );
    expect(buildFetchUrl(BASE, 'avenged-sevenfold', 'dear-god', 'bass', 'principal')).toBe(
      `${BASE}/avenged-sevenfold/dear-god/tabs-baixo/`,
    );
    expect(buildFetchUrl(BASE, 'avenged-sevenfold', 'dear-god', 'bass', 'simplificada')).toBe(
      `${BASE}/avenged-sevenfold/dear-god/tabs-baixo/simplificada.html`,
    );
    expect(buildFetchUrl(BASE, 'coldplay', 'the-scientist', 'lyrics', 'original')).toBe(
      `${BASE}/coldplay/the-scientist/letra/`,
    );
  });
});

describe('parseCifraClubHtml', () => {
  it('parses lyric chord content', () => {
    const result = parseCifraClubHtml(CHORD_HTML, 'coldplay', 'the-scientist', BASE);
    expect(result?.content).toContain('<b>Dm7</b>');
    expect(result?.tone).toBe('Dm');
    expect(result?.chords?.map((chord) => chord.symbol)).toEqual(['Dm7', 'Bb9']);
  });

  it('prefers lyric chords over tablature for cifra-group', () => {
    const mixed = [
      wrapChunk(
        '#t1#E|----------|#/t1#\\n[Primeira Parte]\\n\\n<b>Am</b>         <b>F6(11+)</b>\\n  Such a lonely day',
      ),
      wrapChunk(
        '{"songData":{"priorityVersions":[{"id":1,"instrument":{"slug":"cifra-group","name":"Violão"},"label":{"name":"Principal","slug":"principal"}}],"artist":{"name":"SOAD"},"song":{"name":"Lonely Day"},"id":1,"status":0}}',
      ),
    ].join('');

    const result = parseCifraClubHtml(mixed, 'system-of-a-down', 'lonely-day', BASE);
    expect(result?.content).toContain('<b>Am</b>');
    expect(result?.content).toContain('Such a lonely day');
    expect(result?.content).not.toContain('#t1#');
    expect(result?.content).not.toMatch(/^E\|/m);
  });

  it('parses lyrics instrument', () => {
    const result = parseCifraClubHtml(LYRICS_HTML, 'coldplay', 'the-scientist', BASE, 'lyrics');
    expect(result?.content).toContain("Come up to meet you");
    expect(result?.chords).toBeUndefined();
  });

  it('parses bass tablature', () => {
    const result = parseCifraClubHtml(BASS_HTML, 'avenged-sevenfold', 'buried-alive--', BASE, 'bass');
    expect(result?.content).toContain('G|');
    expect(result?.chords).toBeUndefined();
  });

  it('preserves rhythm rows and continuation staves in bass tablature', () => {
    const continuation = [
      wrapChunk([
        '     Q    Q    Q    Q',
        'G||----------------------|',
        'D||--3----3----3----3----|',
        'A||----------------------|',
        'D||----------------------|',
        '',
        '  Q    Q    Q    Q',
        '----------------------|',
        '--2----2----2----2----|',
        '----------------------|',
        '----------------------|',
        '\\n/ - tremolo bar dip',
      ].join('\n')),
      wrapChunk(
        '{"songData":{"priorityVersions":[],"artist":{"name":"A7X"},"song":{"name":"Dear God"},"id":32276,"status":0}}',
      ),
    ].join('');

    const result = parseCifraClubHtml(continuation, 'avenged-sevenfold', 'dear-god', BASE, 'bass');
    expect(result?.content).toContain('Q    Q    Q    Q');
    expect(result?.content).toContain('--2----2----2----2----|');
    expect(result?.content).toContain('\\n/ - tremolo bar dip');
    expect(result?.content.split('\n')).toHaveLength(12);
  });

  it('parses keyboard like cifra when chord content exists', () => {
    const result = parseCifraClubHtml(CHORD_HTML, 'coldplay', 'the-scientist', BASE, 'keyboard');
    expect(result?.content).toContain('Dm7');
  });

  it('keeps lyric sections after inline tablature markers', () => {
    const mixed = [
      wrapChunk(
        [
          'Afinação: D A D G B E',
          '[Intro] <b>D7M</b>  <b>B2</b>',
          '[Tab - Intro]',
          '#t1#E|----------|#/t1#',
          '[Primeira Parte]',
          '<b>B2</b>',
          "Hello I've waited here for you",
        ].join('\n'),
      ),
      wrapChunk(
        '{"songData":{"priorityVersions":[{"id":1,"instrument":{"slug":"cifra-group","name":"Violão"},"label":{"name":"Principal","slug":"principal"}}],"artist":{"name":"Foo Fighters"},"song":{"name":"Everlong"},"id":887,"status":0,"tone":"D"}}',
      ),
    ].join('');

    const result = parseCifraClubHtml(mixed, 'foo-fighters', 'everlong', BASE);
    expect(result?.content).toContain('<b>D7M</b>');
    expect(result?.content).toContain('[Primeira Parte]');
    expect(result?.content).toContain("Hello I've waited here for you");
    expect(result?.content).not.toContain('[Tab - Intro]');
    expect(result?.content).not.toContain('E|----------|');
    expect(result?.chords?.map((chord) => chord.symbol)).toEqual(['D7M', 'B2']);
  });
});
