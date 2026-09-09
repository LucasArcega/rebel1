import { Link } from 'react-router-dom';
import { Button, Input } from '@/shared/ui';
import { useSearchChordForm } from '../model/use-search-chord-form';

export const SearchChordForm = () => {
  const { query, setQuery, submit, history } = useSearchChordForm();

  return (
    <form className="search-form" onSubmit={submit}>
      <label className="field">
        <span>Artista, música ou os dois</span>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ex.: Avenged Sevenfold Buried Alive"
          required
          minLength={2}
        />
      </label>

      <Button type="submit">Buscar</Button>

      {history.length > 0 && (
        <div className="search-history">
          <span className="search-history__label">Recentes</span>
          <div className="search-history__list">
            {history.map((item) => (
              <Link key={item} to={`/search?q=${encodeURIComponent(item)}`} className="search-history__chip">
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};
