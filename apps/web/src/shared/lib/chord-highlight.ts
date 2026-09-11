import { parseChordSymbol } from '@cifra-hub/shared';

export type ChordSegment = {
  type: 'text' | 'chord';
  value: string;
};

const TAB_MARKERS = /#\/?t\d+#/g;
const BOLD_CHORD = /<b>([\s\S]*?)<\/b>/gi;
const SECTION_HEADER = /^\[[^\]]+\]$/;
const TUNING_LINE = /^\s*afina(?:ção|cao)\s*:/i;

const isTabLine = (line: string) => /^[A-Ga-g][#b]?\s*\|/.test(line.trim());
const isChordToken = (token: string) => Boolean(parseChordSymbol(token));

const isChordLine = (line: string) => {
  const plain = line.replace(/<[^>]+>/g, ' ').trim();
  if (!plain || isTabLine(line) || TUNING_LINE.test(plain)) return false;
  const tokens = plain.split(/\s+/).filter(Boolean);
  const chords = tokens.filter((token) => isChordToken(token));
  return chords.length >= Math.max(1, Math.ceil(tokens.length * 0.6));
};

export const isSectionHeaderLine = (line: string) => SECTION_HEADER.test(line.trim());
export const isTuningLine = (line: string) => TUNING_LINE.test(line.replace(/<[^>]+>/g, '').trim());

export const cleanChordContent = (content: string) => content.replace(TAB_MARKERS, '');

export const splitChordLine = (line: string): ChordSegment[] => {
  if (!line.includes('<b>')) {
    return isChordLine(line)
      ? splitPlainTokens(line)
      : [{ type: 'text', value: line }];
  }

  const segments: ChordSegment[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(BOLD_CHORD)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      pushText(segments, line.slice(lastIndex, index));
    }
    segments.push({ type: 'chord', value: match[1] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < line.length) {
    pushText(segments, line.slice(lastIndex));
  }

  return segments;
};

const pushText = (segments: ChordSegment[], value: string) => {
  if (!value) return;
  const last = segments.at(-1);
  if (last?.type === 'text') {
    last.value += value;
    return;
  }
  segments.push({ type: 'text', value });
};

const splitPlainTokens = (line: string): ChordSegment[] => {
  const segments: ChordSegment[] = [];

  for (const token of line.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token) || !isChordToken(token)) {
      pushText(segments, token);
      continue;
    }
    segments.push({ type: 'chord', value: token });
  }

  return segments;
};

export const splitChordContent = (content: string): ChordSegment[] => {
  const cleaned = cleanChordContent(content);

  if (!cleaned.includes('<b>')) {
    const segments: ChordSegment[] = [];
    const lines = cleaned.split('\n');

    lines.forEach((line, index) => {
      segments.push(...splitChordLine(line));
      if (index < lines.length - 1) pushText(segments, '\n');
    });

    return segments;
  }

  const segments: ChordSegment[] = [];
  let lastIndex = 0;

  for (const match of cleaned.matchAll(BOLD_CHORD)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      pushText(segments, cleaned.slice(lastIndex, index));
    }
    segments.push({ type: 'chord', value: match[1] });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < cleaned.length) {
    pushText(segments, cleaned.slice(lastIndex));
  }

  return segments;
};
