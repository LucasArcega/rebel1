import type { SearchResult } from '../model/types.js';

interface SolrDocument {
  t: string;
  art?: string;
  dns?: string;
  txt?: string;
  url?: string;
  imgm?: string;
  h?: number;
}

interface SolrResponse {
  response: {
    docs: SolrDocument[];
  };
}

const SOLR_URL = 'https://solr.sscdn.co/solr/cifraclub/select';

export const searchSongs = async (query: string, limit = 20): Promise<SearchResult[]> => {
  const params = new URLSearchParams({
    q: query,
    wt: 'json',
    rows: String(limit),
  });

  const response = await fetch(`${SOLR_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Falha na busca: ${response.status}`);
  }

  const payload = (await response.json()) as SolrResponse;

  return payload.response.docs
    .filter((doc) => doc.t === '2' && doc.dns && doc.url && doc.txt)
    .map((doc) => ({
      artistSlug: doc.dns!,
      artistName: doc.art ?? doc.dns!,
      songSlug: doc.url!,
      songName: doc.txt!,
      imageUrl: doc.imgm || null,
      hits: doc.h ?? null,
    }));
};
