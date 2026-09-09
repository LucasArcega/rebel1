import { useSearchParams } from 'react-router-dom';
import { SearchResultsList, useSearchQuery } from '@/features/search-results';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const { data, isLoading, isError, error } = useSearchQuery(query);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Resultados</h1>
        {query && <p className="page-header__subtitle">Buscando por &quot;{query}&quot;</p>}
      </header>

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
