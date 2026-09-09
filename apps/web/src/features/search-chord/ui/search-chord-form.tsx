import { Button, Input } from '@/shared/ui';
import { useSearchChordForm } from '../model/use-search-chord-form';

export const SearchChordForm = () => {
  const { artist, song, setArtist, setSong, submit } = useSearchChordForm();

  return (
    <form className="search-form" onSubmit={submit}>
      <label className="field">
        <span>Artista (slug)</span>
        <Input
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
          placeholder="avenged-sevenfold"
          required
        />
      </label>

      <label className="field">
        <span>Música (slug)</span>
        <Input
          value={song}
          onChange={(event) => setSong(event.target.value)}
          placeholder="buried-alive--"
          required
        />
      </label>

      <Button type="submit">Buscar cifra</Button>
    </form>
  );
};
