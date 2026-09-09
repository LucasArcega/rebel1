import { OfflineLibraryList } from '@/features/offline-library';

export const LibraryPage = () => (
  <div className="page">
    <header className="page-header">
      <h1>Cifras salvas</h1>
      <p className="page-header__subtitle">
        Disponíveis offline depois que você abrir a música pelo menos uma vez online.
      </p>
    </header>

    <section className="offline-panel">
      <OfflineLibraryList />
    </section>
  </div>
);
