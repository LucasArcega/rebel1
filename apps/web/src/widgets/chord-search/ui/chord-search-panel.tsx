import { SearchChordForm } from '@/features/search-chord';

export const ChordSearchPanel = () => (
  <section className="search-panel">
    <h2>Buscar cifra</h2>
    <p className="search-panel__hint">
      Use os slugs do Cifra Club (ex.: <code>avenged-sevenfold</code> / <code>buried-alive--</code>).
    </p>
    <SearchChordForm />
  </section>
);
