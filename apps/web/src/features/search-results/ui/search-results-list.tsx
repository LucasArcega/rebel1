import { Link } from 'react-router-dom';
import type { SearchResult } from '@/entities/search';
import { Spinner } from '@/shared/ui';

interface SearchResultsListProps {
  query: string;
  results: SearchResult[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export const SearchResultsList = ({
  query,
  results,
  isLoading,
  isError,
  errorMessage,
}: SearchResultsListProps) => {
  if (isLoading) {
    return (
      <div className="page page--centered">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-state">
        <h2>Erro na busca</h2>
        <p>{errorMessage ?? 'Não foi possível buscar agora.'}</p>
      </div>
    );
  }

  if (!results?.length) {
    return (
      <div className="empty-state">
        <h2>Nenhum resultado</h2>
        <p>Não encontramos cifras para &quot;{query}&quot;.</p>
      </div>
    );
  }

  return (
    <ul className="search-results">
      {results.map((result) => (
        <li key={`${result.artistSlug}-${result.songSlug}`}>
          <Link
            to={`/artists/${result.artistSlug}/songs/${result.songSlug}`}
            className="search-result-card"
          >
            {result.imageUrl ? (
              <img src={result.imageUrl} alt="" className="search-result-card__image" />
            ) : (
              <div className="search-result-card__placeholder" aria-hidden />
            )}
            <div>
              <strong>{result.songName}</strong>
              <span>{result.artistName}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
