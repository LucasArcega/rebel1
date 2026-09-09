import { httpClient } from '@/shared/api/http-client';
import type { SearchResult } from '../model/types';

interface SearchResponse {
  data: SearchResult[];
}

export const searchApi = {
  search: (query: string) => httpClient<SearchResponse>(`/search?q=${encodeURIComponent(query)}`),
};
