import type { ChordSong } from '@/entities/chord';
import { VersionSelector } from '@/features/select-version';
import { ChordContent } from './chord-content';
import { ChordMeta } from './chord-meta';

interface ChordViewerProps {
  chord: ChordSong;
}

export const ChordViewer = ({ chord }: ChordViewerProps) => (
  <section className="chord-viewer">
    <header className="chord-viewer__header">
      <div>
        <p className="chord-viewer__artist">{chord.artistName}</p>
        <h1 className="chord-viewer__title">{chord.songName}</h1>
      </div>
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
