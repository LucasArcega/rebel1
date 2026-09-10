export type InstrumentSlug =
  | 'cifra-group'
  | 'lyrics'
  | 'bass'
  | 'drums'
  | 'guitar'
  | 'sheet'
  | 'harmonica'
  | 'keyboard'
  | 'ukulele'
  | 'viola'
  | 'guitarpro';

export interface ChordVersion {
  id: number;
  label: string;
  labelSlug: string;
  instrument: string;
  instrumentSlug: InstrumentSlug;
  path: string;
}

export interface ChordSong {
  artistSlug: string;
  artistName: string;
  songSlug: string;
  songName: string;
  versionId: number;
  tone: string | null;
  tuning: string | null;
  composers: string[];
  hits: number | null;
  youtubeId: string | null;
  cifraclubUrl: string;
  content: string;
  /** Structured chord symbols, when the source contains reliable harmonic markup. */
  chords?: ChordOccurrence[];
  versions: ChordVersion[];
}

export interface ChordOccurrence {
  /** Original spelling as it appeared in the song. */
  symbol: string;
  /** Stable canonical key used by the fingering dictionary. */
  normalizedSymbol: string;
  /** Zero-based ordinal after de-duplication. */
  order: number;
}
