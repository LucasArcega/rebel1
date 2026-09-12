import { LINES_PER_BEAT_STEP, MAX_BPM, MAX_LINES_PER_BEAT, MIN_BPM, MIN_LINES_PER_BEAT } from '@cifra-hub/shared';
import type { BpmSource } from '@cifra-hub/shared';
import { Button, Input, Slider } from '@/shared/ui';

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
  tapCount?: number;
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
  tapCount = 0,
}: AutoScrollBpmControlsProps) => {
  const badge = sourceLabel(bpmSource, isFetchingBpm);

  return (
    <div className="auto-scroll">
      <div className="auto-scroll__header">
        <span className="auto-scroll__label">Auto-scroll</span>
        {badge && <span className="auto-scroll__badge">{badge}</span>}
      </div>

      <div className="auto-scroll__actions">
        <Button type="button" variant="secondary" size="compact" onClick={onToggle}>
          {isPlaying ? 'Pausar' : 'Rolar'}
        </Button>
        <Button type="button" variant="secondary" size="compact" onClick={onTap} aria-label="Tap tempo">
          {tapCount > 0 ? `Tap · ${tapCount}` : 'Tap'}
        </Button>
      </div>

      <div className="auto-scroll__field">
        <div className="auto-scroll__bpm">
          <Input
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            aria-label="BPM"
            onChange={(event) => onBpmChange(Number(event.target.value))}
          />
          <Slider
            aria-label="Ajuste de BPM"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            onValueChange={onBpmChange}
          />
        </div>
      </div>

      <Slider
        label="Linhas por batida"
        aria-label="Linhas por batida"
        min={MIN_LINES_PER_BEAT}
        max={MAX_LINES_PER_BEAT}
        step={LINES_PER_BEAT_STEP}
        value={linesPerBeat}
        onValueChange={onLinesPerBeatChange}
      />
      <span className="auto-scroll__hint">{linesPerBeat.toFixed(2)}</span>

      {bpmError && (
        <p className="auto-scroll__message" role="alert">
          {bpmError}
        </p>
      )}
    </div>
  );
};
