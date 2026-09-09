import type { ChordSong } from '@/entities/chord';

interface ChordMetaProps {
  chord: ChordSong;
}

export const ChordMeta = ({ chord }: ChordMetaProps) => (
  <div className="chord-meta">
    <div className="chord-meta__row">
      <span>Tom: {chord.tone ?? '—'}</span>
      {chord.tuning && <span>Afinação: {chord.tuning}</span>}
      {chord.hits && <span>{chord.hits.toLocaleString('pt-BR')} visualizações</span>}
    </div>

    {chord.composers.length > 0 && (
      <p className="chord-meta__composers">
        Composição: {chord.composers.join(', ')}
      </p>
    )}

    <div className="chord-meta__links">
      <a href={chord.cifraclubUrl} target="_blank" rel="noreferrer">
        Ver no Cifra Club
      </a>
      {chord.youtubeId && (
        <a
          href={`https://www.youtube.com/watch?v=${chord.youtubeId}`}
          target="_blank"
          rel="noreferrer"
        >
          YouTube
        </a>
      )}
    </div>
  </div>
);
