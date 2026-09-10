import type { SearchResult } from './types.js';

interface SolrDocument {
  t: string;
  art?: string;
  dns?: string;
  txt?: string;
  url?: string;
  imgm?: string;
  h?: number;
  icbx?: number;
}

interface SolrResponse {
  response: {
    docs: SolrDocument[];
  };
}

const SOLR_URL = 'https://solr.sscdn.co/solr/cifraclub/select';

const fetchSolr = async (params: URLSearchParams): Promise<SolrResponse> => {
  const response = await fetch(`${SOLR_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Falha na busca: ${response.status}`);
  }

  return response.json() as Promise<SolrResponse>;
};

export const searchSongs = async (query: string, limit = 20): Promise<SearchResult[]> => {
  const params = new URLSearchParams({
    q: query,
    wt: 'json',
    rows: String(limit),
  });

  const payload = await fetchSolr(params);

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

const quoteSolrValue = (value: string) => `"${value.replace(/([\\"])/g, '\\$1')}"`;

/** Return the indexed principal bass version without probing every instrument URL. */
export const findBassVersionId = async (
  artistSlug: string,
  songSlug: string,
): Promise<number | null> => {
  const params = new URLSearchParams({
    q: `dns:${quoteSolrValue(artistSlug)} AND url:${quoteSolrValue(songSlug)}`,
    fl: 't,dns,url,icbx',
    wt: 'json',
    rows: '1',
  });
  const payload = await fetchSolr(params);
  const match = payload.response.docs.find((doc) =>
    doc.t === '2' && doc.dns === artistSlug && doc.url === songSlug,
  );

  return typeof match?.icbx === 'number' && match.icbx > 0 ? match.icbx : null;
};
