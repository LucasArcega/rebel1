const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

const CHORD_PATTERN =
  /(?<![A-Za-z])([A-G](?:#|b)?(?:m|M|maj|min|dim|aug|sus|add)?[0-9]*(?:sus[24])?(?:\/[A-G](?:#|b)?)?)(?![A-Za-z])/g;

const parseNoteIndex = (note: string): number | null => NOTE_TO_INDEX[note] ?? null;

const formatNote = (index: number, preferFlats: boolean) => {
  const scale = preferFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP;
  return scale[((index % 12) + 12) % 12];
};

const transposeNote = (note: string, semitones: number, preferFlats: boolean) => {
  const index = parseNoteIndex(note);
  if (index === null) return note;
  return formatNote(index + semitones, preferFlats);
};

export const transposeChord = (chord: string, semitones: number, preferFlats = false) => {
  if (!semitones) return chord;

  const slashIndex = chord.indexOf('/');
  const base = slashIndex === -1 ? chord : chord.slice(0, slashIndex);
  const bass = slashIndex === -1 ? '' : chord.slice(slashIndex + 1);

  const rootMatch = base.match(/^([A-G](?:#|b)?)/);
  if (!rootMatch) return chord;

  let result = transposeNote(rootMatch[1], semitones, preferFlats) + base.slice(rootMatch[1].length);

  if (bass) {
    const bassMatch = bass.match(/^([A-G](?:#|b)?)/);
    if (bassMatch) {
      result += `/${transposeNote(bassMatch[1], semitones, preferFlats)}${bass.slice(bassMatch[1].length)}`;
    } else {
      result += `/${bass}`;
    }
  }

  return result;
};

export const hasTransposableChords = (content: string) => {
  CHORD_PATTERN.lastIndex = 0;
  return CHORD_PATTERN.test(content);
};

export const transposeContent = (content: string, semitones: number, preferFlats = false) => {
  if (!semitones) return content;
  return content.replace(CHORD_PATTERN, (match) => transposeChord(match, semitones, preferFlats));
};

export const computeTransposeSemitones = (manualSemitones: number, capoFret: number) =>
  manualSemitones - capoFret;

export const formatDisplayedTone = (tone: string | null, semitones: number, preferFlats = false) => {
  if (!tone) return null;
  const rootMatch = tone.match(/^([A-G](?:#|b)?)/);
  if (!rootMatch) return tone;
  const suffix = tone.slice(rootMatch[1].length);
  return `${transposeNote(rootMatch[1], semitones, preferFlats)}${suffix}`;
};
