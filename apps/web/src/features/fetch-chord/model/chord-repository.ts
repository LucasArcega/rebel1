import { chordApi, type ChordSearchParams, type ChordSong } from '@/entities/chord';
import { offlineChordStorage } from '@/entities/offline-chord';
import { offlineLibraryQueryKey } from '@/entities/offline-chord';
import { ApiError } from '@/shared/api/http-client';
import { queryClient } from '@/shared/lib/query-client';

export interface ChordFetchResult {
  chord: ChordSong;
  source: 'network' | 'offline';
}

export const chordRepository = {
  fetch: async (params: ChordSearchParams): Promise<ChordFetchResult> => {
    try {
      const response = await chordApi.getBySlug(params);
      await offlineChordStorage.save(response.data, params.instrument);
      queryClient.invalidateQueries({ queryKey: offlineLibraryQueryKey });

      return {
        chord: response.data,
        source: 'network',
      };
    } catch (error) {
      const offlineChord = await offlineChordStorage.get(params);

      if (offlineChord) {
        return {
          chord: offlineChord,
          source: 'offline',
        };
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError('Sem conexão e cifra não encontrada offline', 0);
    }
  },
};
