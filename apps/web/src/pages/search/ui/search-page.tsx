import { useSearchParams } from 'react-router-dom';
import { SearchChordForm } from '@/features/search-chord';
import { SearchResultsList, useSearchQuery } from '@/features/search-results';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const { data, isLoading, isError, error } = useSearchQuery(query);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Busca</h1>
        {query && (
          <p className="page-header__subtitle">
            {isLoading
              ? `Buscando por "${query}"…`
              : `${data?.length ?? 0} resultado(s) para "${query}"`}
          </p>
        )}
      </header>

      <SearchChordForm />

      <SearchResultsList
        query={query}
        results={data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      />
    </div>
  );
};
