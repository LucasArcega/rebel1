import type { ChordOccurrence } from '../chord/types.js';
import { parseChordSymbol } from './chord-symbol.js';

const BOLD_PATTERN = /<b(?:\s[^>]*)?>([\s\S]*?)<\/b>/gi;
const SECTION_PATTERN = /^\s*\[[^\]]+\]\s*$/;
const TOKEN_EDGE_PATTERN = /^[|:(),.;]+|[|:(),.;]+$/g;

const chordCandidates = (value: string): string[] =>
  value
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .map((token) => token.replace(TOKEN_EDGE_PATTERN, ''))
    .filter(Boolean);

const toOccurrences = (symbols: readonly string[]): ChordOccurrence[] => {
  const result: ChordOccurrence[] = [];
  const seen = new Set<string>();
  for (const symbol of symbols) {
    const parsed = parseChordSymbol(symbol);
    if (!parsed || seen.has(parsed.normalized)) continue;
    seen.add(parsed.normalized);
    result.push({ symbol: parsed.raw, normalizedSymbol: parsed.normalized, order: result.length });
  }
  return result;
};

/**
 * Extract chords without guessing inside prose. Semantic `<b>` markup wins; legacy
 * text is accepted only when a complete line looks like a chord row.
 */
export const extractChordOccurrences = (content: string): ChordOccurrence[] => {
  const boldSymbols: string[] = [];
  for (const match of content.matchAll(BOLD_PATTERN)) {
    for (const candidate of chordCandidates(match[1])) {
      if (parseChordSymbol(candidate)) boldSymbols.push(candidate);
    }
  }
  if (boldSymbols.length) return toOccurrences(boldSymbols);

  const symbols: string[] = [];
  for (const originalLine of content.split(/\r?\n/)) {
    const line = originalLine.trim();
    if (!line || SECTION_PATTERN.test(line) || /^[EADGBe]\|/.test(line)) continue;

    const candidates = chordCandidates(line.replace(/^\[[^\]]+\]\s*/, ''));
    if (!candidates.length) continue;
    const parsed = candidates.map(parseChordSymbol);
    if (parsed.some((candidate) => candidate === null)) continue;

    // A lone natural major (`A`, `C`...) is indistinguishable from ordinary text.
    if (candidates.length === 1 && /^[A-G]$/.test(candidates[0])) continue;
    symbols.push(...candidates);
  }
  return toOccurrences(symbols);
};

export const extractBoldChordOccurrences = (content: string): ChordOccurrence[] => {
  if (!/<b(?:\s[^>]*)?>/i.test(content)) return [];
  return extractChordOccurrences(content);
};
