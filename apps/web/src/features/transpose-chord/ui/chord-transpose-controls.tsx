import { Button, IconButton, Select } from '@/shared/ui';

interface ChordTransposeControlsProps {
  manualSemitones: number;
  capoFret: number;
  effectiveSemitones: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onCapoChange: (fret: number) => void;
  onReset: () => void;
}

const capoItems = Array.from({ length: 12 }, (_, fret) => ({
  value: String(fret),
  label: fret === 0 ? 'Sem capo' : `Casa ${fret}`,
}));

export const ChordTransposeControls = ({
  manualSemitones,
  capoFret,
  effectiveSemitones,
  onIncrease,
  onDecrease,
  onCapoChange,
  onReset,
}: ChordTransposeControlsProps) => (
  <div className="chord-transpose">
    <div className="chord-transpose__group">
      <span className="chord-transpose__label">Tom</span>
      <div className="chord-transpose__buttons">
        <IconButton aria-label="Descer meio tom" variant="secondary" size="compact" onClick={onDecrease}>
          −
        </IconButton>
        <span className="chord-transpose__value">
          {manualSemitones > 0 ? `+${manualSemitones}` : manualSemitones}
        </span>
        <IconButton aria-label="Subir meio tom" variant="secondary" size="compact" onClick={onIncrease}>
          +
        </IconButton>
      </div>
    </div>

    <Select
      label="Capotraste"
      value={String(capoFret)}
      onValueChange={(value) => onCapoChange(Number(value))}
      items={capoItems}
    />

    {(manualSemitones !== 0 || capoFret !== 0) && (
      <div className="chord-transpose__summary">
        <span>Transposição efetiva: {effectiveSemitones > 0 ? `+${effectiveSemitones}` : effectiveSemitones} semitom(s)</span>
        <Button type="button" variant="ghost" size="compact" onClick={onReset}>
          Resetar
        </Button>
      </div>
    )}
  </div>
);
