import type { ChordSong } from '@/entities/chord';
import type { ChordFetchResult } from '@/features/fetch-chord';
import { VersionSelector } from '@/features/select-version';
import { ChordContent } from './chord-content';
import { ChordMeta } from './chord-meta';

interface ChordViewerProps {
  chord: ChordSong;
  source?: ChordFetchResult['source'];
}

export const ChordViewer = ({ chord, source }: ChordViewerProps) => (
  <section className="chord-viewer">
    <header className="chord-viewer__header">
      <div>
        <p className="chord-viewer__artist">{chord.artistName}</p>
        <h1 className="chord-viewer__title">{chord.songName}</h1>
      </div>
      {source === 'offline' && <span className="offline-badge">Offline</span>}
      {source === 'network' && <span className="saved-badge">Salva offline</span>}
    </header>

    <VersionSelector
      artistSlug={chord.artistSlug}
      songSlug={chord.songSlug}
      versions={chord.versions}
      activeVersionId={chord.versionId}
    />

    <ChordMeta chord={chord} />
    <ChordContent content={chord.content} />
  </section>
);
