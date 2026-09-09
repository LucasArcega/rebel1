import { describe, expect, it } from 'vitest';
import { buildFetchUrl, buildVersionPath, parseCifraClubHtml } from './parser.js';

const BASE = 'https://www.cifraclub.com.br';

const wrapChunk = (content: string) =>
  `<script>self.__next_f.push([1,"${content.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"])</script>`;

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
  wrapChunk('Intro\\nG|---------9~~|\\nD|-7~~-10r--------|'),
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
  });
});

describe('parseCifraClubHtml', () => {
  it('parses lyric chord content', () => {
    const result = parseCifraClubHtml(CHORD_HTML, 'coldplay', 'the-scientist', BASE);
    expect(result?.content).toContain('Dm7');
    expect(result?.tone).toBe('Dm');
  });

  it('parses lyrics instrument', () => {
    const result = parseCifraClubHtml(LYRICS_HTML, 'coldplay', 'the-scientist', BASE, 'lyrics');
    expect(result?.content).toContain("Come up to meet you");
  });

  it('parses bass tablature', () => {
    const result = parseCifraClubHtml(BASS_HTML, 'avenged-sevenfold', 'buried-alive--', BASE, 'bass');
    expect(result?.content).toContain('G|');
  });

  it('parses keyboard like cifra when chord content exists', () => {
    const result = parseCifraClubHtml(CHORD_HTML, 'coldplay', 'the-scientist', BASE, 'keyboard');
    expect(result?.content).toContain('Dm7');
  });
});
