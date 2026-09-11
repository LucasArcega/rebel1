import { useEffect, useState } from 'react';
import type { ChordSearchParams, ChordSong } from '@/entities/chord';
import {
  AutoScrollBpmControls,
  GetsongAttribution,
  useAutoScrollBpm,
  useTapTempo,
} from '@/features/auto-scroll-chord';
import { ChordDisplayControls, useChordDisplaySettings } from '@/features/chord-display';
import { resolveBpmErrorMessage, useBpmQuery } from '@/features/fetch-bpm';
import { ChordTransposeControls, useChordTranspose } from '@/features/transpose-chord';
import { VersionSelector } from '@/features/select-version';
import { shouldFetchRemoteBpm } from '@/shared/lib/scroll-bpm-storage';
import { ChordContent } from './chord-content';
import { ChordMeta } from './chord-meta';
import { SongChordStrip } from './song-chord-strip';

interface ChordViewerProps {
  chord: ChordSong;
  fetchParams: Pick<ChordSearchParams, 'instrument' | 'version'>;
}

const LINE_HEIGHT_FALLBACK = {
  sm: 19,
  md: 23,
  lg: 26,
} as const;

const ChordViewerState = ({ chord, fetchParams }: ChordViewerProps) => {
  const activeVersion = chord.versions.find((version) => version.id === chord.versionId);
  const transpose = useChordTranspose(chord);
  const display = useChordDisplaySettings();
  const [lineHeight, setLineHeight] = useState<number>(LINE_HEIGHT_FALLBACK[display.fontSize]);
  const fetchRemoteBpm = shouldFetchRemoteBpm(chord.artistSlug, chord.songSlug);
  const bpmQuery = useBpmQuery(
    {
      artist: chord.artistSlug,
      song: chord.songSlug,
      artistName: chord.artistName,
      songName: chord.songName,
    },
    { enabled: fetchRemoteBpm },
  );
  const autoScroll = useAutoScrollBpm({
    artistSlug: chord.artistSlug,
    songSlug: chord.songSlug,
    lineHeight,
    lookup: bpmQuery.data,
    isFetchingBpm: fetchRemoteBpm && bpmQuery.isLoading,
    bpmError: fetchRemoteBpm && bpmQuery.isError ? resolveBpmErrorMessage(bpmQuery.error) : null,
  });
  const tapTempo = useTapTempo(autoScroll.applyTapBpm);
  const instrument = fetchParams.instrument ?? activeVersion?.instrumentSlug;
  const diagramsDisabledReason = instrument && !['cifra-group', 'guitar'].includes(instrument)
    ? 'Diagramas disponíveis apenas para cifras de violão'
    : undefined;

  useEffect(() => {
    const line = autoScroll.contentRef.current?.querySelector('.chord-line');
    if (!line) {
      setLineHeight(LINE_HEIGHT_FALLBACK[display.fontSize]);
      return;
    }

    const applyHeight = () => {
      const measured = Number.parseFloat(getComputedStyle(line).lineHeight);
      if (Number.isFinite(measured) && measured > 0) {
        setLineHeight(measured);
      }
    };

    applyHeight();
    const observer = new ResizeObserver(applyHeight);
    observer.observe(line);
    return () => observer.disconnect();
  }, [autoScroll.contentRef, display.fontSize, chord.versionId]);

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
          <AutoScrollBpmControls
            isPlaying={autoScroll.isPlaying}
            bpm={autoScroll.bpm}
            linesPerBeat={autoScroll.linesPerBeat}
            bpmSource={autoScroll.bpmSource}
            isFetchingBpm={autoScroll.isFetchingBpm}
            bpmError={autoScroll.bpmError}
            onToggle={autoScroll.toggle}
            onBpmChange={autoScroll.setBpm}
            onLinesPerBeatChange={autoScroll.setLinesPerBeat}
            onTap={tapTempo.tap}
          />
          <ChordDisplayControls
            fontSize={display.fontSize}
            theme={display.theme}
            onFontSizeChange={display.setFontSize}
            onToggleTheme={display.toggleTheme}
            onPrint={display.printChord}
          />
        </div>

        <GetsongAttribution visible={autoScroll.bpmSource === 'getsong'} />
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
