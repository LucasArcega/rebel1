import { Link } from 'react-router-dom';
import { useOfflineLibrary } from '../model/use-offline-library';
import { Spinner } from '@/shared/ui';

export const OfflineLibraryList = () => {
  const { items, isLoading, remove, isRemoving } = useOfflineLibrary();

  if (isLoading) {
    return <Spinner />;
  }

  if (!items.length) {
    return (
      <p className="offline-library__empty">
        Nenhuma cifra salva ainda. Abra uma música online para baixá-la automaticamente.
      </p>
    );
  }

  return (
    <ul className="offline-library">
      {items.map((item) => (
        <li key={item.id} className="offline-library__item">
          <Link to={`/artists/${item.artistSlug}/songs/${item.songSlug}`}>
            <strong>{item.chord.songName}</strong>
            <span>{item.chord.artistName}</span>
            <small>
              Salva em {new Date(item.savedAt).toLocaleString('pt-BR')}
            </small>
          </Link>
          <button
            type="button"
            className="offline-library__remove"
            disabled={isRemoving}
            onClick={() => remove(item.id)}
          >
            Remover
          </button>
        </li>
      ))}
    </ul>
  );
};
