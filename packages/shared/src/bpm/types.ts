export const MIN_BPM = 40;
export const MAX_BPM = 240;
export const MIN_PROVIDER_BPM = 40;
export const MAX_PROVIDER_BPM = 220;
export const MIN_LINES_PER_BEAT = 0.5;
export const MAX_LINES_PER_BEAT = 4;
export const LINES_PER_BEAT_STEP = 0.25;
export const DEFAULT_BPM = 120;
export const DEFAULT_LINES_PER_BEAT = 1;

export type BpmSource = 'getsong' | 'tap' | 'manual';
export type BpmLookupSource = 'getsongbpm' | 'cache';

export interface GetSongBpmHit {
  id: string;
  title: string;
  artistName: string;
  tempo: number;
  timeSig?: string;
  key?: string;
}

export interface GetSongBpmLookupResult {
  bpm: number;
  key?: string;
  timeSig?: string;
  externalId?: string;
  source: BpmLookupSource;
  attribution: {
    name: 'GetSongBPM';
    url: 'https://getsongbpm.com';
  };
}

export const GETSONGBPM_ATTRIBUTION = {
  name: 'GetSongBPM' as const,
  url: 'https://getsongbpm.com' as const,
};
