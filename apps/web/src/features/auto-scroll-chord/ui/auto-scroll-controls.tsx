interface AutoScrollControlsProps {
  isPlaying: boolean;
  speed: number;
  onToggle: () => void;
  onSpeedChange: (speed: number) => void;
}

export const AutoScrollControls = ({
  isPlaying,
  speed,
  onToggle,
  onSpeedChange,
}: AutoScrollControlsProps) => (
  <div className="auto-scroll">
    <span className="auto-scroll__label">Auto-scroll</span>
    <button type="button" className="auto-scroll__btn" onClick={onToggle}>
      {isPlaying ? 'Pausar' : 'Rolar'}
    </button>
    <label className="auto-scroll__speed">
      Velocidade
      <input
        type="range"
        min={20}
        max={120}
        step={10}
        value={speed}
        onChange={(event) => onSpeedChange(Number(event.target.value))}
      />
    </label>
  </div>
);
