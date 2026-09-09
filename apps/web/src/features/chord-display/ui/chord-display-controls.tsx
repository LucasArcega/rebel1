import type { FontSize } from '../model/use-chord-display-settings';

interface ChordDisplayControlsProps {
  fontSize: FontSize;
  theme: 'dark' | 'light';
  onFontSizeChange: (size: FontSize) => void;
  onToggleTheme: () => void;
  onPrint: () => void;
}

export const ChordDisplayControls = ({
  fontSize,
  theme,
  onFontSizeChange,
  onToggleTheme,
  onPrint,
}: ChordDisplayControlsProps) => (
  <div className="chord-display-controls">
    <label className="chord-display-controls__group">
      Fonte
      <select
        value={fontSize}
        onChange={(event) => onFontSizeChange(event.target.value as FontSize)}
      >
        <option value="sm">Pequena</option>
        <option value="md">Média</option>
        <option value="lg">Grande</option>
      </select>
    </label>
    <button type="button" className="chord-display-controls__btn" onClick={onToggleTheme}>
      Tema {theme === 'dark' ? 'claro' : 'escuro'}
    </button>
    <button type="button" className="chord-display-controls__btn" onClick={onPrint}>
      Imprimir
    </button>
  </div>
);
