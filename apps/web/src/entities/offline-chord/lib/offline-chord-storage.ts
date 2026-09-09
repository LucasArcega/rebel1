import type { ChordSearchParams, ChordSong } from '@/entities/chord';
import {
  buildOfflineChordId,
  offlineDb,
  type OfflineChordRecord,
} from '@/shared/lib/offline-db';

export const offlineChordStorage = {
  save: async (chord: ChordSong, instrument?: ChordSearchParams['instrument']) => {
    const id = buildOfflineChordId(chord.artistSlug, chord.songSlug, instrument);
    const record: OfflineChordRecord = {
      id,
      artistSlug: chord.artistSlug,
      songSlug: chord.songSlug,
      instrument: instrument ?? 'cifra-group',
      savedAt: new Date().toISOString(),
      chord,
    };

    await offlineDb.save(record);
    return record;
  },

  get: async (params: ChordSearchParams) => {
    const id = buildOfflineChordId(params.artist, params.song, params.instrument);
    const record = await offlineDb.get(id);
    return record?.chord ?? null;
  },

  list: () => offlineDb.getAll(),

  remove: (id: string) => offlineDb.delete(id),
};
