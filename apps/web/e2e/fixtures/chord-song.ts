export interface ChordOccurrenceFixture {
  symbol: string;
  normalizedSymbol: string;
  order: number;
}

const versions = [
  {
    id: 1,
    label: 'Principal',
    labelSlug: 'principal',
    instrument: 'Cifra',
    instrumentSlug: 'cifra-group',
    path: '/fixture-artist/diagramas/',
  },
  {
    id: 2,
    label: 'Simplificada',
    labelSlug: 'simplificada',
    instrument: 'Cifra',
    instrumentSlug: 'cifra-group',
    path: '/fixture-artist/diagramas/simplificada.html',
  },
] as const;

const baseSong = {
  artistSlug: 'fixture-artist',
  artistName: 'Fixture Artist',
  songSlug: 'diagramas',
  songName: 'Diagramas',
  versionId: 1,
  tone: 'Am',
  tuning: null,
  composers: [],
  hits: 1,
  youtubeId: null,
  cifraclubUrl: 'https://www.cifraclub.com.br/fixture-artist/diagramas/',
  versions: [...versions],
};

export const chordSongFixture = {
  ...baseSong,
  content: '[Intro]\nAm  Bm11  C  C9\nD  D9/F#  E\n',
  chords: [
    { symbol: 'Am', normalizedSymbol: 'Am', order: 0 },
    { symbol: 'Bm11', normalizedSymbol: 'Bm11', order: 1 },
    { symbol: 'C', normalizedSymbol: 'C', order: 2 },
    { symbol: 'C9', normalizedSymbol: 'C9', order: 3 },
    { symbol: 'D', normalizedSymbol: 'D', order: 4 },
    { symbol: 'D9/F#', normalizedSymbol: 'D9/F#', order: 5 },
    { symbol: 'E', normalizedSymbol: 'E', order: 6 },
  ] satisfies ChordOccurrenceFixture[],
};

export const legacyChordSongFixture = {
  ...baseSong,
  songName: 'Legada',
  content: '[Intro]\nAm  C  D9/F#  E\nA vida corre e ganha novos caminhos\n',
};

export const alternateTuningChordSongFixture = {
  ...chordSongFixture,
  songName: 'Afinação alternativa',
  tuning: 'D A D G A D',
};

export const missingFingeringChordSongFixture = {
  ...baseSong,
  songName: 'Sem digitação',
  content: '[Intro]\nC7(b9)\n',
  chords: [{ symbol: 'C7(b9)', normalizedSymbol: 'C7b9', order: 0 }],
};

export const simplifiedChordSongFixture = {
  ...baseSong,
  versionId: 2,
  songName: 'Diagramas',
  content: '[Intro]\nG  D  Em\n',
  chords: [
    { symbol: 'G', normalizedSymbol: 'G', order: 0 },
    { symbol: 'D', normalizedSymbol: 'D', order: 1 },
    { symbol: 'Em', normalizedSymbol: 'Em', order: 2 },
  ] satisfies ChordOccurrenceFixture[],
};

export type ChordSongFixture = typeof chordSongFixture | typeof legacyChordSongFixture;
