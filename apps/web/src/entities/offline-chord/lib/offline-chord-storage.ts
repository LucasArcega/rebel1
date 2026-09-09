import type { ChordSearchParams, ChordSong } from '@/entities/chord';
import {
  buildOfflineChordId,
  offlineDb,
  type OfflineChordRecord,
} from '@/shared/lib/offline-db';

export const offlineChordStorage = {
  save: async (chord: ChordSong, params: Pick<ChordSearchParams, 'instrument' | 'version'>) => {
    const id = buildOfflineChordId(chord.artistSlug, chord.songSlug, params.instrument, params.version);
    const record: OfflineChordRecord = {
      id,
      artistSlug: chord.artistSlug,
      songSlug: chord.songSlug,
      instrument: params.instrument ?? 'cifra-group',
      version: params.version ?? 'principal',
      savedAt: new Date().toISOString(),
      chord,
    };

    await offlineDb.save(record);
    return record;
  },

  get: async (params: ChordSearchParams) => {
    const id = buildOfflineChordId(params.artist, params.song, params.instrument, params.version);
    const record = await offlineDb.get(id);
    return record?.chord ?? null;
  },

  list: () => offlineDb.getAll(),

  remove: (id: string) => offlineDb.delete(id),
};
