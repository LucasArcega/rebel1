import { SearchChordForm } from '@/features/search-chord';

export const ChordSearchPanel = () => (
  <section className="search-panel">
    <h2>Buscar cifra</h2>
    <p className="search-panel__hint">
      Digite o nome do artista, da música ou ambos. Ex.: <code>Avenged Sevenfold Buried Alive</code>.
    </p>
    <SearchChordForm />
  </section>
);
