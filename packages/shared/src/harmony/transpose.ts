import type { ChordOccurrence } from '../chord/types.js';
import { extractChordOccurrences } from './extract-chords.js';
import { NOTE_TO_PITCH_CLASS } from './chord-formula.js';
import { parseChordSymbol, type NoteName } from './chord-symbol.js';

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;
const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
const BOLD_PATTERN = /(<b(?:\s[^>]*)?>)([\s\S]*?)(<\/b>)/gi;
const TOKEN_PATTERN = /(?<![A-Za-z])([A-G](?:#|b)?[^\s<|,;:]*)/g;

const formatNote = (index: number, preferFlats: boolean) =>
  (preferFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP)[((index % 12) + 12) % 12];

const transposeNote = (note: NoteName, semitones: number, preferFlats: boolean) =>
  formatNote(NOTE_TO_PITCH_CLASS[note] + semitones, preferFlats || note.endsWith('b'));

export const transposeChord = (symbol: string, semitones: number, preferFlats = false): string => {
  const parsed = parseChordSymbol(symbol);
  if (!parsed || !semitones) return symbol;

  const root = transposeNote(parsed.root, semitones, preferFlats);
  const slashIndex = symbol.lastIndexOf('/');
  const suffixEnd = slashIndex === -1 ? symbol.length : slashIndex;
  const suffix = symbol.slice(parsed.root.length, suffixEnd);
  const bass = parsed.bass ? `/${transposeNote(parsed.bass, semitones, preferFlats)}` : '';
  return `${root}${suffix}${bass}`;
};

const transposeTokenText = (value: string, semitones: number, preferFlats: boolean): string =>
  value.replace(TOKEN_PATTERN, (match) =>
    parseChordSymbol(match) ? transposeChord(match, semitones, preferFlats) : match,
  );

export const transposeContent = (content: string, semitones: number, preferFlats = false): string => {
  if (!semitones) return content;
  if (/<b(?:\s[^>]*)?>/i.test(content)) {
    return content.replace(BOLD_PATTERN, (_, open: string, body: string, close: string) =>
      `${open}${transposeTokenText(body, semitones, preferFlats)}${close}`,
    );
  }

  if (!extractChordOccurrences(content).length) return content;
  return content
    .split(/(\r?\n)/)
    .map((line) => {
      if (/^\r?\n$/.test(line)) return line;
      return extractChordOccurrences(line).length
        ? transposeTokenText(line, semitones, preferFlats)
        : line;
    })
    .join('');
};

export const transposeChordOccurrences = (
  occurrences: readonly ChordOccurrence[],
  semitones: number,
  preferFlats = false,
): ChordOccurrence[] =>
  occurrences.map((occurrence) => {
    const symbol = transposeChord(occurrence.symbol, semitones, preferFlats);
    const parsed = parseChordSymbol(symbol);
    return {
      symbol,
      normalizedSymbol: parsed?.normalized ?? occurrence.normalizedSymbol,
      order: occurrence.order,
    };
  });

export const computeTransposeSemitones = (manualSemitones: number, capoFret: number): number =>
  manualSemitones - capoFret;

export const formatDisplayedTone = (
  tone: string | null,
  semitones: number,
  preferFlats = false,
): string | null => (tone ? transposeChord(tone, semitones, preferFlats) : null);

export const hasTransposableChords = (content: string): boolean =>
  extractChordOccurrences(content).length > 0;
