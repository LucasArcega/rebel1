import { OfflineLibraryList } from '@/features/offline-library';
import { ChordSearchPanel } from '@/widgets/chord-search';

export const HomePage = () => (
  <div className="page">
    <section className="hero">
      <h1>Cifra Hub</h1>
      <p>
        Busque por nome, abra a cifra e ela fica salva no seu dispositivo para uso offline.
      </p>
    </section>
    <ChordSearchPanel />
    <section className="offline-panel">
      <h2>Salvas no dispositivo</h2>
      <OfflineLibraryList />
    </section>
  </div>
);
