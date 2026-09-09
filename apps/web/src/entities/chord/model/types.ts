import type { InstrumentSlug as SharedInstrumentSlug } from '@cifra-hub/shared';

export type {
  ChordSong,
  ChordVersion,
  InstrumentSlug,
} from '@cifra-hub/shared';

export interface ChordSearchParams {
  artist: string;
  song: string;
  instrument?: SharedInstrumentSlug;
  version?: string;
}
