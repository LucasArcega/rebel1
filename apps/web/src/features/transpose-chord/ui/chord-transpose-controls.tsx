interface ChordTransposeControlsProps {
  manualSemitones: number;
  capoFret: number;
  effectiveSemitones: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onCapoChange: (fret: number) => void;
  onReset: () => void;
}

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
        <button type="button" className="chord-transpose__btn" onClick={onDecrease} aria-label="Descer meio tom">
          −
        </button>
        <span className="chord-transpose__value">
          {manualSemitones > 0 ? `+${manualSemitones}` : manualSemitones}
        </span>
        <button type="button" className="chord-transpose__btn" onClick={onIncrease} aria-label="Subir meio tom">
          +
        </button>
      </div>
    </div>

    <div className="chord-transpose__group">
      <label className="chord-transpose__label" htmlFor="capo-fret">Capotraste</label>
      <select
        id="capo-fret"
        className="chord-transpose__select"
        value={capoFret}
        onChange={(event) => onCapoChange(Number(event.target.value))}
      >
        {Array.from({ length: 12 }, (_, fret) => (
          <option key={fret} value={fret}>
            {fret === 0 ? 'Sem capo' : `Casa ${fret}`}
          </option>
        ))}
      </select>
    </div>

    {(manualSemitones !== 0 || capoFret !== 0) && (
      <div className="chord-transpose__summary">
        <span>Transposição efetiva: {effectiveSemitones > 0 ? `+${effectiveSemitones}` : effectiveSemitones} semitom(s)</span>
        <button type="button" className="chord-transpose__reset" onClick={onReset}>
          Resetar
        </button>
      </div>
    )}
  </div>
);
