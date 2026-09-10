import { extractChordOccurrences } from '../harmony/extract-chords.js';
import type { ChordSong, ChordVersion, InstrumentSlug } from './types.js';

const INSTRUMENT_PATHS: Record<string, string> = {
  'cifra-group': '',
  lyrics: '/letra',
  bass: '/tabs-baixo',
  drums: '/tabs-bateria',
  guitar: '/tabs-guitarra',
  sheet: '/partituras',
  harmonica: '/tabs-gaita',
  keyboard: '/teclado',
  ukulele: '/ukulele',
  viola: '/viola',
  guitarpro: '/guitarpro',
};

const TAB_LINE_PATTERN = /^[EADGB]\|/m;
const RSC_PAYLOAD_STOP_MARKERS = ['","metadata"', '"\\n"]', '</pre>'];
const CHUNK_STOP_MARKERS = [...RSC_PAYLOAD_STOP_MARKERS, '"/t', '#/t'];
const TABLATURE_STOP_MARKERS = [
  ...CHUNK_STOP_MARKERS,
  '[Primeira Parte]',
  '[Intro]',
  '[Refrão]',
  '[Refrao]',
];
const LYRIC_CHORD_INSTRUMENTS = new Set<InstrumentSlug>([
  'cifra-group',
  'keyboard',
  'ukulele',
  'viola',
]);
const TAB_MARKER_PATTERN = /#\/?t\d+#/g;
const TAB_BLOCK_PATTERN = /(?:^[ \t]*\[Tab[^\]]*\][ \t]*\r?\n)?#t(\d+)#[\s\S]*?#\/t\1#[ \t]*(?:\r?\n)?/gim;

const decodeRscChunk = (chunk: string): string => {
  try {
    return JSON.parse(`"${chunk}"`) as string;
  } catch {
    return chunk
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
};

const extractRscChunks = (html: string): string[] => {
  const chunks: string[] = [];
  const pattern = /self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)/g;

  for (const match of html.matchAll(pattern)) {
    chunks.push(decodeRscChunk(match[1]));
  }

  return chunks;
};

const decodeChordEntities = (value: string): string =>
  value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripChordHtml = (value: string): string =>
  decodeChordEntities(value)
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const cleanExtractedContent = (value: string): string =>
  decodeChordEntities(value)
    .replace(TAB_BLOCK_PATTERN, '')
    .replace(TAB_MARKER_PATTERN, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const sliceUntilMarkers = (chunk: string, start: number, stops = CHUNK_STOP_MARKERS): string => {
  let end = chunk.length;

  for (const stop of stops) {
    const idx = chunk.indexOf(stop, start);
    if (idx > start) end = Math.min(end, idx);
  }

  return chunk.slice(start, end).trim();
};

const unescapeJsonString = (value: string): string =>
  value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\');

const extractJsonStringField = (chunk: string, field: string): string | null => {
  const marker = `"${field}":"`;
  const start = chunk.indexOf(marker);
  if (start === -1) return null;

  let index = start + marker.length;
  let result = '';

  while (index < chunk.length) {
    const char = chunk[index];

    if (char === '\\' && index + 1 < chunk.length) {
      const next = chunk[index + 1];
      if (next === 'n') {
        result += '\n';
        index += 2;
        continue;
      }
      if (next === 'r') {
        result += '\r';
        index += 2;
        continue;
      }
      if (next === 't') {
        result += '\t';
        index += 2;
        continue;
      }
      if (next === '"') {
        result += '"';
        index += 2;
        continue;
      }
      if (next === '\\') {
        result += '\\';
        index += 2;
        continue;
      }
      result += char;
      index += 1;
      continue;
    }

    if (char === '"') break;

    result += char;
    index += 1;
  }

  return result || null;
};

const normalizeLyricsText = (raw: string) =>
  unescapeJsonString(raw).replace(/\\\n/g, '\n').trim();

const isLikelyLyricsContent = (value: string) =>
  value.length > 30 && !value.includes('<') && !value.includes('device-width');

const extractLyricsFromSection = (section: string): string | null => {
  const contentMarker = section.indexOf('"content":"');
  if (contentMarker === -1) return null;

  const raw = extractJsonStringField(section.slice(contentMarker), 'content');
  if (!raw || !isLikelyLyricsContent(raw)) return null;

  return normalizeLyricsText(raw);
};

const extractLyricsContent = (chunks: string[]): string | null => {
  for (const chunk of chunks) {
    const initialMarker = chunk.indexOf('"initialSong"');
    if (initialMarker !== -1) {
      const lyrics = extractLyricsFromSection(chunk.slice(initialMarker));
      if (lyrics) return lyrics;
    }
  }

  for (const chunk of chunks) {
    const songDataMarker = chunk.indexOf('"songData"');
    if (songDataMarker === -1) continue;

    const lyrics = extractLyricsFromSection(chunk.slice(songDataMarker));
    if (lyrics) return lyrics;
  }

  return null;
};

const extractTablatureContent = (chunk: string): string | null => {
  if (!chunk.includes('#t1#') || !chunk.includes('|')) return null;

  const marker = chunk.indexOf('#t1#');
  const start = chunk.indexOf('E|', marker);
  if (start === -1) return null;

  const extracted = cleanExtractedContent(sliceUntilMarkers(chunk, start, TABLATURE_STOP_MARKERS));
  return extracted || null;
};

const extractGenericTablatureContent = (chunk: string): string | null => {
  if (!TAB_LINE_PATTERN.test(chunk)) return null;

  const match = chunk.match(/^(?:Intro|Vers[oõ]|Refr[aã]o|\d+:\d+)?\s*\n?[EADGB]\|/m);
  const tabStart = match?.index ?? chunk.search(/[EADGB]\|/);
  if (tabStart === -1) return null;

  const prefix = chunk.slice(0, tabStart);
  const start = prefix.length <= 500 && !/[{<]/.test(prefix) ? 0 : tabStart;

  const slice = sliceUntilMarkers(chunk, start, TABLATURE_STOP_MARKERS);
  if ((slice.match(/^[EADGB]\|/gm) ?? []).length < 2) return null;

  const extracted = cleanExtractedContent(slice);
  return extracted || null;
};

const extractLyricChordContent = (chunk: string): string | null => {
  if (!chunk.includes('[Primeira Parte]') && !chunk.includes('<b>')) return null;

  let sectionStart = chunk.search(/\[(?:Intro|Primeira Parte|Segunda Parte|Refr[aã]o|Ponte|Solo|Final)/i);
  if (sectionStart === -1) {
    sectionStart = chunk.search(/<b>/i);
  }
  if (sectionStart === -1) return null;

  const tuningMatch = chunk.slice(0, sectionStart).match(/Afin[a-zA-ZçãõÇÃÕ: ]+/i);
  const body = cleanExtractedContent(sliceUntilMarkers(chunk, sectionStart, RSC_PAYLOAD_STOP_MARKERS));
  const tuning = tuningMatch ? stripChordHtml(tuningMatch[0]).trim() : null;

  return tuning ? `${tuning}\n\n${body}` : body || null;
};

const extractFirstMatch = (
  chunks: string[],
  extractor: (chunk: string) => string | null,
): string | null => {
  for (const chunk of chunks) {
    const match = extractor(chunk);
    if (match) return match;
  }

  return null;
};

const extractChordContent = (chunks: string[], instrument: InstrumentSlug): string | null => {
  if (instrument === 'lyrics') {
    const lyrics = extractLyricsContent(chunks);
    if (lyrics) return lyrics;
  }

  const lyricChords = () => extractFirstMatch(chunks, extractLyricChordContent);
  const tablature = () =>
    extractFirstMatch(chunks, extractTablatureContent) ??
    extractFirstMatch(chunks, extractGenericTablatureContent);

  const preferLyricChords = LYRIC_CHORD_INSTRUMENTS.has(instrument);
  const content = preferLyricChords
    ? lyricChords() ?? tablature()
    : tablature() ?? lyricChords();

  if (content) return content;

  if (instrument !== 'lyrics') {
    const fallbackLyrics = extractLyricsContent(chunks);
    if (fallbackLyrics) return fallbackLyrics;
  }

  return null;
};

const extractJsonField = (text: string, field: string): string | null => {
  const pattern = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`);
  return text.match(pattern)?.[1] ?? null;
};

export const buildVersionPath = (
  artistSlug: string,
  songSlug: string,
  instrumentSlug: InstrumentSlug,
  labelSlug: string,
): string => {
  const instrumentSuffix = INSTRUMENT_PATHS[instrumentSlug] ?? '';
  const basePath = `/${artistSlug}/${songSlug}${instrumentSuffix}`;
  const isDefaultVersion = labelSlug === 'principal' || labelSlug === 'original';

  if (isDefaultVersion) return `${basePath}/`;
  if (instrumentSlug === 'cifra-group') return `${basePath}/${labelSlug}/`;
  return `${basePath}/${labelSlug}.html`;
};

const extractPriorityVersions = (text: string, artistSlug: string, songSlug: string): ChordVersion[] => {
  const start = text.indexOf('"priorityVersions":');
  if (start === -1) return [];

  const arrayStart = text.indexOf('[', start);
  if (arrayStart === -1) return [];

  let depth = 0;
  let arrayEnd = -1;

  for (let index = arrayStart; index < text.length; index += 1) {
    const char = text[index];
    if (char === '[') depth += 1;
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        arrayEnd = index;
        break;
      }
    }
  }

  if (arrayEnd === -1) return [];

  try {
    const raw = JSON.parse(text.slice(arrayStart, arrayEnd + 1)) as Array<{
      id: number;
      instrument: { slug: InstrumentSlug; name: string };
      label: { name: string; slug: string };
    }>;

    return raw.map((version) => {
      const path = buildVersionPath(artistSlug, songSlug, version.instrument.slug, version.label.slug);

      return {
        id: version.id,
        label: version.label.name,
        labelSlug: version.label.slug,
        instrument: version.instrument.name,
        instrumentSlug: version.instrument.slug,
        path,
      };
    });
  } catch {
    return [];
  }
};

const extractYoutubeId = (html: string): string | null => {
  const match = html.match(/i\.ytimg\.com\/vi\/([^/]+)\//);
  return match?.[1] ?? null;
};

export const parseCifraClubHtml = (
  html: string,
  artistSlug: string,
  songSlug: string,
  cifraclubBaseUrl: string,
  instrument: InstrumentSlug = 'cifra-group',
  version = 'principal',
): ChordSong | null => {
  const chunks = extractRscChunks(html);
  const songChunk = chunks.find((chunk) => chunk.includes('"songData"') && chunk.includes('"priorityVersions"'));

  if (!songChunk) return null;

  const artistName =
    extractJsonField(songChunk, 'name') ??
    songChunk.match(/"artist"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/)?.[1] ??
    artistSlug;

  const songName =
    songChunk.match(/"song"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"/)?.[1] ??
    extractJsonField(songChunk, 'name') ??
    songSlug;

  const versionId = Number(songChunk.match(/"id":(\d+),"status":0/)?.[1] ?? 0);
  const tone = songChunk.match(/"tone"\s*:\s*"([^"]+)"/)?.[1] ?? null;
  const tuning = songChunk.match(/"tuning"\s*:\s*"([^"]+)"/)?.[1] ?? null;
  const hits = Number(songChunk.match(/"all_time_hits"\s*:\s*(\d+)/)?.[1] ?? 0) || null;

  const composersMatch = songChunk.match(/"composers"\s*:\s*(\[[^\]]+\])/);
  const composers = composersMatch ? (JSON.parse(composersMatch[1]) as string[]) : [];

  const content = extractChordContent(chunks, instrument);
  if (!content) return null;

  const versions = extractPriorityVersions(songChunk, artistSlug, songSlug);
  const chords = LYRIC_CHORD_INSTRUMENTS.has(instrument)
    ? extractChordOccurrences(content)
    : undefined;

  return {
    artistSlug,
    artistName,
    songSlug,
    songName,
    versionId,
    tone,
    tuning,
    composers,
    hits,
    youtubeId: extractYoutubeId(html),
    cifraclubUrl: `${cifraclubBaseUrl}${buildVersionPath(artistSlug, songSlug, instrument, version)}`,
    content,
    chords,
    versions,
  };
};

export const buildFetchUrl = (
  baseUrl: string,
  artistSlug: string,
  songSlug: string,
  instrument?: InstrumentSlug,
  version?: string,
): string => {
  const instrumentSlug = instrument ?? 'cifra-group';
  const labelSlug = version ?? 'principal';

  return `${baseUrl}${buildVersionPath(artistSlug, songSlug, instrumentSlug, labelSlug)}`;
};
