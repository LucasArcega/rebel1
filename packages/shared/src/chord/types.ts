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
  versions: ChordVersion[];
}
