import { useQuery } from '@tanstack/react-query';
import type { ChordSearchParams } from '@/entities/chord';
import { chordRepository } from './chord-repository';

export const chordQueryKey = (params: ChordSearchParams) => ['chord', params];

export const useChordQuery = (params: ChordSearchParams) =>
  useQuery({
    queryKey: chordQueryKey(params),
    queryFn: () => chordRepository.fetch(params),
    enabled: Boolean(params.artist && params.song),
  });
