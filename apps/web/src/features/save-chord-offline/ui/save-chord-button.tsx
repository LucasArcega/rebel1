import { useState } from 'react';
import type { ChordSearchParams, ChordSong } from '@/entities/chord';
import { offlineChordStorage } from '@/entities/offline-chord';
import { offlineLibraryQueryKey } from '@/entities/offline-chord';
import { queryClient } from '@/shared/lib/query-client';

interface SaveChordButtonProps {
  chord: ChordSong;
  params: Pick<ChordSearchParams, 'instrument' | 'version'>;
}

export const SaveChordButton = ({ chord, params }: SaveChordButtonProps) => {
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await offlineChordStorage.save(chord, params);
    queryClient.invalidateQueries({ queryKey: offlineLibraryQueryKey });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <button type="button" className="save-chord-btn" onClick={save}>
      {saved ? 'Salva!' : 'Salvar offline'}
    </button>
  );
};
