import { Button, Input } from '@/shared/ui';
import { useSearchChordForm } from '../model/use-search-chord-form';

export const SearchChordForm = () => {
  const { query, setQuery, submit } = useSearchChordForm();

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
    </form>
  );
};
