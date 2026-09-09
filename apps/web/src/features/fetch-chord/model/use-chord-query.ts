import { useQuery } from '@tanstack/react-query';
import { chordApi, type ChordSearchParams } from '@/entities/chord';

export const chordQueryKey = (params: ChordSearchParams) => ['chord', params];

export const useChordQuery = (params: ChordSearchParams) =>
  useQuery({
    queryKey: chordQueryKey(params),
    queryFn: () => chordApi.getBySlug(params),
    select: (response) => response.data,
    enabled: Boolean(params.artist && params.song),
  });
