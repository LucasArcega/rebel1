import { LINES_PER_BEAT_STEP, MAX_BPM, MAX_LINES_PER_BEAT, MIN_BPM, MIN_LINES_PER_BEAT } from '@cifra-hub/shared';
import type { BpmSource } from '@cifra-hub/shared';

interface AutoScrollBpmControlsProps {
  isPlaying: boolean;
  bpm: number;
  linesPerBeat: number;
  bpmSource: BpmSource | null;
  isFetchingBpm: boolean;
  bpmError: string | null;
  onToggle: () => void;
  onBpmChange: (bpm: number) => void;
  onLinesPerBeatChange: (linesPerBeat: number) => void;
  onTap: () => void;
}

const sourceLabel = (
  bpmSource: BpmSource | null,
  isFetchingBpm: boolean,
) => {
  if (isFetchingBpm) {
    return '…';
  }

  if (bpmSource === 'getsong') {
    return 'GetSong';
  }

  if (bpmSource === 'tap') {
    return 'Tap';
  }

  if (bpmSource === 'manual') {
    return 'Manual';
  }

  return null;
};

export const AutoScrollBpmControls = ({
  isPlaying,
  bpm,
  linesPerBeat,
  bpmSource,
  isFetchingBpm,
  bpmError,
  onToggle,
  onBpmChange,
  onLinesPerBeatChange,
  onTap,
}: AutoScrollBpmControlsProps) => {
  const badge = sourceLabel(bpmSource, isFetchingBpm);

  return (
    <div className="auto-scroll">
      <div className="auto-scroll__header">
        <span className="auto-scroll__label">Auto-scroll</span>
        {badge && <span className="auto-scroll__badge">{badge}</span>}
      </div>

      <div className="auto-scroll__actions">
        <button type="button" className="auto-scroll__btn" onClick={onToggle}>
          {isPlaying ? 'Pausar' : 'Rolar'}
        </button>
        <button type="button" className="auto-scroll__btn" onClick={onTap}>
          Tap
        </button>
      </div>

      <label className="auto-scroll__field">
        BPM
        <div className="auto-scroll__bpm">
          <input
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            onChange={(event) => onBpmChange(Number(event.target.value))}
          />
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            onChange={(event) => onBpmChange(Number(event.target.value))}
          />
        </div>
      </label>

      <label className="auto-scroll__field">
        Linhas por batida
        <input
          type="range"
          min={MIN_LINES_PER_BEAT}
          max={MAX_LINES_PER_BEAT}
          step={LINES_PER_BEAT_STEP}
          value={linesPerBeat}
          onChange={(event) => onLinesPerBeatChange(Number(event.target.value))}
        />
        <span className="auto-scroll__hint">{linesPerBeat.toFixed(2)}</span>
      </label>

      {bpmError && (
        <p className="auto-scroll__message" role="alert">
          {bpmError}
        </p>
      )}
    </div>
  );
};
