import type { ChordSearchParams, ChordSong } from '@/entities/chord/model/types';
import { httpClient } from '@/shared/api/http-client';

interface ChordResponse {
  data: ChordSong;
}

const buildChordQuery = ({ instrument, version }: Pick<ChordSearchParams, 'instrument' | 'version'>) => {
  const params = new URLSearchParams();

  if (instrument) {
    params.set('instrument', instrument);
  }

  if (version) {
    params.set('version', version);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const chordApi = {
  getBySlug: ({ artist, song, instrument, version }: ChordSearchParams) =>
    httpClient<ChordResponse>(`/artists/${artist}/songs/${song}${buildChordQuery({ instrument, version })}`),
};
