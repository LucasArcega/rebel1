import type { ChordSong, InstrumentSlug } from '@/entities/chord';

const DB_NAME = 'cifra-hub';
const DB_VERSION = 1;
const STORE_NAME = 'chords';

export interface OfflineChordRecord {
  id: string;
  artistSlug: string;
  songSlug: string;
  instrument: InstrumentSlug | 'cifra-group';
  version: string;
  savedAt: string;
  chord: ChordSong;
}

export const buildOfflineChordId = (
  artistSlug: string,
  songSlug: string,
  instrument?: InstrumentSlug,
  version?: string,
) => `${artistSlug}/${songSlug}/${instrument ?? 'cifra-group'}/${version ?? 'principal'}`;

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const runTransaction = async <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = callback(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const offlineDb = {
  save: (record: OfflineChordRecord) =>
    runTransaction('readwrite', (store) => store.put(record)),

  get: (id: string) =>
    runTransaction<OfflineChordRecord | undefined>('readonly', (store) => store.get(id)),

  getAll: () =>
    runTransaction<OfflineChordRecord[]>('readonly', (store) => store.getAll()),

  delete: (id: string) => runTransaction('readwrite', (store) => store.delete(id)),
};
