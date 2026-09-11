import { useParams, useSearchParams } from 'react-router-dom';
import { useChordQuery } from '@/features/fetch-chord';
import { parseInstrumentFromSearch, parseVersionFromSearch } from '@/features/select-version';
import { ApiError } from '@/shared/api/http-client';
import { Spinner } from '@/shared/ui';
import { ChordViewer } from '@/widgets/chord-viewer';

const resolveErrorMessage = (error: Error | null) => {
  if (!error) return 'Erro desconhecido';

  if (error instanceof ApiError) {
    if (error.code === 'PARSE_FAILED') {
      return 'Este instrumento ou versão ainda não é suportado.';
    }
    if (error.code === 'NOT_FOUND_ON_CC') {
      return 'Transcrição não disponível no Cifra Club para esta música.';
    }
    if (error.code === 'FETCH_FAILED' || error.status === 0) {
      return 'Sem conexão. Verifique sua rede ou abra uma versão salva na biblioteca.';
    }
  }

  return error.message;
};

const resolveErrorHint = (error: Error | null) => {
  if (error instanceof ApiError && error.code === 'PARSE_FAILED') {
    return 'Tente a versão Principal ou outro instrumento no seletor.';
  }

  return 'Se você já abriu essa música antes, ela pode estar na biblioteca offline.';
};

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
          <p>{resolveErrorMessage(error)}</p>
          <p className="error-state__hint">{resolveErrorHint(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--song">
      <ChordViewer chord={chord} fetchParams={{ instrument, version }} />
    </div>
  );
};
