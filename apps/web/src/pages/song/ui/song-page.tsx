import { useParams, useSearchParams } from 'react-router-dom';
import { useChordQuery } from '@/features/fetch-chord';
import { parseInstrumentFromSearch, parseVersionFromSearch } from '@/features/select-version';
import { Spinner } from '@/shared/ui';
import { ChordViewer } from '@/widgets/chord-viewer';

export const SongPage = () => {
  const { artist = '', song = '' } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();
  const instrument = parseInstrumentFromSearch(search);
  const version = parseVersionFromSearch(search);

  const { data, isLoading, isError, error } = useChordQuery({
    artist,
    song,
    instrument,
    version,
  });

  const chord = data?.chord;
  const source = data?.source;

  if (isLoading) {
    return (
      <div className="page page--centered">
        <Spinner />
      </div>
    );
  }

  if (isError || !chord) {
    return (
      <div className="page">
        <div className="error-state">
          <h2>Não foi possível carregar a cifra</h2>
          <p>{error?.message ?? 'Erro desconhecido'}</p>
          <p className="error-state__hint">
            Se você já abriu essa música antes, ela pode estar na biblioteca offline.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <ChordViewer chord={chord} source={source} />
    </div>
  );
};
