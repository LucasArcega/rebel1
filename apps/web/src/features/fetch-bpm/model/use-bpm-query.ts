import { useQuery } from '@tanstack/react-query';
import { bpmApi, type BpmLookupParams } from '@/entities/bpm';
import { ApiError } from '@/shared/api/http-client';

export const bpmQueryKey = (params: Pick<BpmLookupParams, 'artist' | 'song'>) =>
  ['bpm', params.artist, params.song] as const;

export const useBpmQuery = (params: BpmLookupParams, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: bpmQueryKey(params),
    queryFn: () => bpmApi.lookup(params),
    enabled: Boolean(params.artist && params.song) && (options?.enabled ?? true),
    staleTime: 24 * 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && [400, 404, 501].includes(error.status)) {
        return false;
      }

      return failureCount < 1;
    },
    select: (response) => response.data,
  });
