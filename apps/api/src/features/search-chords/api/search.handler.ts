import { searchSongs } from '../../../entities/search/lib/solr-client.js';

export const searchChords = async (query: string, limit?: number) => {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return [];
  }

  return searchSongs(trimmed, limit);
};
