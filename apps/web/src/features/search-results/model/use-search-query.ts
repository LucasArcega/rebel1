import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/entities/search';

export const searchQueryKey = (query: string) => ['search', query];

export const useSearchQuery = (query: string) =>
  useQuery({
    queryKey: searchQueryKey(query),
    queryFn: () => searchApi.search(query),
    select: (response) => response.data,
    enabled: query.trim().length >= 2,
  });
