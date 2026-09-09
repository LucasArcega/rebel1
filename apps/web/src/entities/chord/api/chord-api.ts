import type { ChordSearchParams, ChordSong } from '@/entities/chord/model/types';
import { httpClient } from '@/shared/api/http-client';

interface ChordResponse {
  data: ChordSong;
}

export const chordApi = {
  getBySlug: ({ artist, song, instrument }: ChordSearchParams) => {
    const query = instrument ? `?instrument=${instrument}` : '';
    return httpClient<ChordResponse>(`/artists/${artist}/songs/${song}${query}`);
  },
};
