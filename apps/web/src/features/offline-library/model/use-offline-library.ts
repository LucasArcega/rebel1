import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { offlineChordStorage, offlineLibraryQueryKey } from '@/entities/offline-chord';

export const useOfflineLibrary = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: offlineLibraryQueryKey,
    queryFn: () => offlineChordStorage.list(),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => offlineChordStorage.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: offlineLibraryQueryKey });
    },
  });

  const sorted = [...(query.data ?? [])].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  return {
    items: sorted,
    isLoading: query.isLoading,
    remove: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
  };
};
