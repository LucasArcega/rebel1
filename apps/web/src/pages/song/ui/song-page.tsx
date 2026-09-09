import { useParams, useSearchParams } from 'react-router-dom';
import { useChordQuery } from '@/features/fetch-chord';
import { parseInstrumentFromSearch } from '@/features/select-version';
import { Spinner } from '@/shared/ui';
import { ChordViewer } from '@/widgets/chord-viewer';

export const SongPage = () => {
  const { artist = '', song = '' } = useParams();
  const [searchParams] = useSearchParams();
  const instrument = parseInstrumentFromSearch(searchParams.toString());

  const { data, isLoading, isError, error } = useChordQuery({
    artist,
    song,
    instrument,
  });

  if (isLoading) {
    return (
      <div className="page page--centered">
        <Spinner />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>Não foi possível carregar a cifra</h2>
          <p>{error?.message ?? 'Erro desconhecido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <ChordViewer chord={data} />
    </div>
  );
};
