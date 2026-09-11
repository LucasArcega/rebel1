import type { ChordSearchParams, ChordSong } from '@/entities/chord';
import { AutoScrollControls, useAutoScroll } from '@/features/auto-scroll-chord';
import { ChordDisplayControls, useChordDisplaySettings } from '@/features/chord-display';
import { ChordTransposeControls, useChordTranspose } from '@/features/transpose-chord';
import { VersionSelector } from '@/features/select-version';
import { ChordContent } from './chord-content';
import { ChordMeta } from './chord-meta';
import { SongChordStrip } from './song-chord-strip';

interface ChordViewerProps {
  chord: ChordSong;
  fetchParams: Pick<ChordSearchParams, 'instrument' | 'version'>;
}

const ChordViewerState = ({ chord, fetchParams }: ChordViewerProps) => {
  const activeVersion = chord.versions.find((version) => version.id === chord.versionId);
  const transpose = useChordTranspose(chord);
  const autoScroll = useAutoScroll();
  const display = useChordDisplaySettings();
  const instrument = fetchParams.instrument ?? activeVersion?.instrumentSlug;
  const diagramsDisabledReason = instrument && !['cifra-group', 'guitar'].includes(instrument)
    ? 'Diagramas disponíveis apenas para cifras de violão'
    : undefined;

  return (
    <section className="chord-viewer">
      <aside className="chord-viewer__sidebar">
        <VersionSelector
          artistSlug={chord.artistSlug}
          songSlug={chord.songSlug}
          versions={chord.versions}
          activeVersionId={chord.versionId}
        />

        <div className="chord-tools">
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
          <AutoScrollControls
            isPlaying={autoScroll.isPlaying}
            speed={autoScroll.speed}
            onToggle={autoScroll.toggle}
            onSpeedChange={autoScroll.setSpeed}
          />
          <ChordDisplayControls
            fontSize={display.fontSize}
            theme={display.theme}
            onFontSizeChange={display.setFontSize}
            onToggleTheme={display.toggleTheme}
            onPrint={display.printChord}
          />
        </div>
      </aside>

      <div className="chord-viewer__stage">
        <header className="chord-viewer__header">
          <p className="chord-viewer__artist">{chord.artistName}</p>
          <h1 className="chord-viewer__title">{chord.songName}</h1>
          {activeVersion && activeVersion.labelSlug !== 'principal' && (
            <span className="version-badge">{activeVersion.instrument} · {activeVersion.label}</span>
          )}
        </header>

        <ChordMeta chord={chord} displayTone={transpose.displayTone} capoFret={transpose.capoFret} />
        <SongChordStrip
          key={`${chord.artistSlug}/${chord.songSlug}/${chord.versionId}`}
          chords={transpose.chordOccurrences}
          tuning={chord.tuning}
          disabledReason={diagramsDisabledReason}
        />
        <ChordContent
          content={transpose.displayContent}
          contentRef={autoScroll.contentRef}
          fontSize={display.fontSize}
          tuning={chord.tuning}
          diagramsEnabled={!diagramsDisabledReason}
        />
      </div>
    </section>
  );
};

export const ChordViewer = (props: ChordViewerProps) => (
  <ChordViewerState
    key={`${props.chord.artistSlug}/${props.chord.songSlug}/${props.chord.versionId}`}
    {...props}
  />
);
