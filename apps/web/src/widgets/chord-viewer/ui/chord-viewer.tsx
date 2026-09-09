import type { ChordSong } from '@/entities/chord';
import type { ChordFetchResult } from '@/features/fetch-chord';
import { ChordTransposeControls, useChordTranspose } from '@/features/transpose-chord';
import { VersionSelector } from '@/features/select-version';
import { ChordContent } from './chord-content';
import { ChordMeta } from './chord-meta';

interface ChordViewerProps {
  chord: ChordSong;
  source?: ChordFetchResult['source'];
}

export const ChordViewer = ({ chord, source }: ChordViewerProps) => {
  const activeVersion = chord.versions.find((version) => version.id === chord.versionId);
  const transpose = useChordTranspose(chord);

  return (
    <section className="chord-viewer">
      <header className="chord-viewer__header">
        <div>
          <p className="chord-viewer__artist">{chord.artistName}</p>
          <h1 className="chord-viewer__title">{chord.songName}</h1>
          {activeVersion && activeVersion.labelSlug !== 'principal' && (
            <span className="version-badge">{activeVersion.label}</span>
          )}
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

      {transpose.canTranspose && (
        <ChordTransposeControls
          manualSemitones={transpose.manualSemitones}
          capoFret={transpose.capoFret}
          effectiveSemitones={transpose.effectiveSemitones}
          onIncrease={transpose.increase}
          onDecrease={transpose.decrease}
          onCapoChange={transpose.setCapoFret}
          onReset={transpose.reset}
        />
      )}

      <ChordMeta chord={chord} displayTone={transpose.displayTone} capoFret={transpose.capoFret} />
      <ChordContent content={transpose.displayContent} />
    </section>
  );
};
