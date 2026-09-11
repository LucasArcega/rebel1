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

  it('keeps every nested drop-tuning tab block for cifra-group', () => {
    const html = [
      wrapChunk(
        [
          '#t1#Intro Lead',
          '#t2#D|----10----|',
          'A|-----9----|',
          'F|-----7----|',
          'C|-----0----|#/t2##/t1#',
          '',
          'Pre-Chorus',
          '',
          '#t1#Intro Base',
          '#t2#D|-8---|',
          'A|-10--|#/t2##/t1#',
        ].join('\n'),
      ),
      wrapChunk(
        '{"songData":{"priorityVersions":[],"artist":{"name":"Killswitch Engage"},"song":{"name":"My Curse"},"id":1,"status":0,"tone":"Bb","tuning":"E A D G B E"}}',
      ),
    ].join('');

    const result = parseCifraClubHtml(html, 'killswitch-engage', 'my-curse', BASE);
    expect(result?.content).toContain('Intro Lead');
    expect(result?.content).toContain('D|----10----|');
    expect(result?.content).toContain('F|-----7----|');
    expect(result?.content).toContain('Pre-Chorus');
    expect(result?.content).toContain('Intro Base');
    expect(result?.content).toContain('D|-8---|');
    expect(result?.content).not.toContain('#t1#');
    expect(result?.content).not.toContain('#t2#');
  });

  it('expands compact drop-tuning tabs glued into a single line', () => {
    const html = [
      wrapChunk(
        'Intro:D--------------------------------------------------------------------------|A------------10------------------10-----------------6----------------6-----|F----10----------10------10----------10-------5--------5------5---------5--|C-8------8------------8------8-------------5-----5---------5------5--------|G--------------------------------------------------------------------------|C--------------------------------------------------------------------------|Intro Continued:D----------------------------------------------------------------|A----------6---------------5--6------------6---------------5--6--|F----5--------5------5---------------5--------5------5-----------|C-7-----7---------7-----7---------7-----7---------7-----7--------| X2G----------------------------------------------------------------|C----------------------------------------------------------------|',
      ),
      wrapChunk(
        '{"songData":{"priorityVersions":[],"artist":{"name":"Killswitch Engage"},"song":{"name":"My Curse Intro"},"id":121077,"status":0,"tone":"Bb","tuning":"E A D G B E"}}',
      ),
    ].join('');

    const result = parseCifraClubHtml(html, 'killswitch-engage', 'my-curse-intro', BASE);
    expect(result?.content).toContain('Intro');
    expect(result?.content).toContain('D|--------------------------------------------------------------------------|');
    expect(result?.content).toContain('A|------------10------------------10-----------------6----------------6-----|');
    expect(result?.content).toContain('F|----10----------10------10----------10-------5--------5------5---------5--|');
    expect(result?.content).toContain('Intro Continued');
    expect(result?.content).toContain('X2');
    expect(result?.content).toMatch(/^G\|/m);
    expect(result?.content.split('\n').length).toBeGreaterThan(10);
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

  it('reads tone from the Cifra Club chord-tone control when JSON omits it', () => {
    const html = [
      '<button type="button" data-anchor="--chord-tone">D</button>',
      wrapChunk('[Primeira Parte]\\n<b>D7M</b>'),
      wrapChunk(
        '{"songData":{"priorityVersions":[],"artist":{"name":"Foo Fighters"},"song":{"name":"Everlong"},"id":887,"status":0}}',
      ),
    ].join('');

    expect(parseCifraClubHtml(html, 'foo-fighters', 'everlong', BASE)?.tone).toBe('D');
  });
});
