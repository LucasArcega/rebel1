import type { BpmLookupSource } from '@cifra-hub/shared';

export interface BpmLookupParams {
  artist: string;
  song: string;
  artistName?: string;
  songName?: string;
}

export interface BpmLookupResult {
  bpm: number;
  key?: string;
  timeSig?: string;
  source: BpmLookupSource;
  externalId?: string;
  attribution?: {
    name: string;
    url: string;
  };
}
