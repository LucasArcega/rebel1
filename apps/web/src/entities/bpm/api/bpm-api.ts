import { httpClient } from '@/shared/api/http-client';
import type { BpmLookupParams, BpmLookupResult } from '../model/types';

interface BpmResponse {
  data: BpmLookupResult;
}

const buildBpmQuery = ({ artist, song, artistName, songName }: BpmLookupParams) => {
  const params = new URLSearchParams({ artist, song });

  if (artistName) {
    params.set('artistName', artistName);
  }

  if (songName) {
    params.set('songName', songName);
  }

  return params.toString();
};

export const bpmApi = {
  lookup: (params: BpmLookupParams) => httpClient<BpmResponse>(`/bpm?${buildBpmQuery(params)}`),
};
