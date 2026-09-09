import { ChordSearchPanel } from '@/widgets/chord-search';

export const HomePage = () => (
  <div className="page">
    <section className="hero">
      <h1>Cifra Hub</h1>
      <p>
        App React com arquitetura FSD + Bulletproof para consumir cifras do Cifra Club via parser SSR.
      </p>
    </section>
    <ChordSearchPanel />
  </div>
);
