import type { ChordSong, ChordVersion, InstrumentSlug } from '../model/types.js';

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

const decodeRscChunk = (chunk: string): string =>
  chunk
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

const extractRscChunks = (html: string): string[] => {
  const chunks: string[] = [];
  const pattern = /self\.__next_f\.push\(\[1,"((?:\\.|[^"\\])*)"\]\)/g;

  for (const match of html.matchAll(pattern)) {
    chunks.push(decodeRscChunk(match[1]));
  }

  return chunks;
};

const stripChordHtml = (value: string): string =>
  value
    .replace(/<b>/g, '')
    .replace(/<\/b>/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const extractTablatureContent = (chunk: string): string | null => {
  if (!chunk.includes('#t1#') || !chunk.includes('|')) return null;

  const marker = chunk.indexOf('#t1#');
  const start = chunk.indexOf('E|', marker);
  if (start === -1) return null;

  let end = chunk.length;
  for (const stop of ['","metadata"', '"/t', '"\\n"]']) {
    const idx = chunk.indexOf(stop, start);
    if (idx !== -1) end = Math.min(end, idx);
  }

  return chunk.slice(start, end).trim();
};

const extractLyricChordContent = (chunk: string): string | null => {
  if (!chunk.includes('[Primeira Parte]') && !chunk.includes('<b>')) return null;

  const sectionStart = chunk.search(/\[(?:Intro|Primeira Parte|Refr[aã]o)/i);
  if (sectionStart === -1) return null;

  const tuningMatch = chunk.slice(0, sectionStart).match(/Afin[a-zA-ZçãõÇÃÕ: ]+/i);

  let end = chunk.length;
  for (const stop of ['","metadata"', '"/t', '"\\n"]', '</pre>']) {
    const idx = chunk.indexOf(stop, sectionStart);
    if (idx !== -1) end = Math.min(end, idx);
  }

  const body = stripChordHtml(chunk.slice(sectionStart, end).trim());
  const tuning = tuningMatch ? stripChordHtml(tuningMatch[0]).trim() : null;
  return tuning ? `${tuning}\n\n${body}` : body;
};

const extractChordContent = (chunks: string[]): string | null => {
  for (const chunk of chunks) {
    const tablature = extractTablatureContent(chunk);
    if (tablature) return tablature;
  }

  for (const chunk of chunks) {
    const lyricChord = extractLyricChordContent(chunk);
    if (lyricChord) return lyricChord;
  }

  return null;
};

const extractJsonField = (text: string, field: string): string | null => {
  const pattern = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`);
  return text.match(pattern)?.[1] ?? null;
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

  const match = [text.slice(arrayStart, arrayEnd + 1)];

  try {
    const raw = JSON.parse(match[0]) as Array<{
      id: number;
      instrument: { slug: InstrumentSlug; name: string };
      label: { name: string; slug: string };
    }>;

    return raw.map((version) => {
      const suffix = INSTRUMENT_PATHS[version.instrument.slug] ?? '';
      const path = `/${artistSlug}/${songSlug}${suffix}/`;

      return {
        id: version.id,
        label: version.label.name,
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

  const content = extractChordContent(chunks);
  if (!content) return null;

  const versions = extractPriorityVersions(songChunk, artistSlug, songSlug);

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
    cifraclubUrl: `${cifraclubBaseUrl}/${artistSlug}/${songSlug}/`,
    content,
    versions,
  };
};

export const buildFetchUrl = (
  baseUrl: string,
  artistSlug: string,
  songSlug: string,
  instrument?: InstrumentSlug,
): string => {
  const suffix = instrument ? INSTRUMENT_PATHS[instrument] ?? '' : '';
  return `${baseUrl}/${artistSlug}/${songSlug}${suffix}/`;
};
