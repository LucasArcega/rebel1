import type { FontSize } from '../model/use-chord-display-settings';
import { Button, Select } from '@/shared/ui';

interface ChordDisplayControlsProps {
  fontSize: FontSize;
  theme: 'dark' | 'light';
  onFontSizeChange: (size: FontSize) => void;
  onToggleTheme: () => void;
  onPrint: () => void;
}

const fontItems = [
  { value: 'sm', label: 'Pequena' },
  { value: 'md', label: 'Média' },
  { value: 'lg', label: 'Grande' },
] as const;

export const ChordDisplayControls = ({
  fontSize,
  theme,
  onFontSizeChange,
  onToggleTheme,
  onPrint,
}: ChordDisplayControlsProps) => (
  <div className="chord-display-controls">
    <Select
      label="Fonte"
      value={fontSize}
      onValueChange={onFontSizeChange}
      items={fontItems}
    />
    <Button type="button" variant="secondary" size="compact" onClick={onToggleTheme}>
      Tema {theme === 'dark' ? 'claro' : 'escuro'}
    </Button>
    <Button type="button" variant="secondary" size="compact" onClick={onPrint}>
      Imprimir
    </Button>
  </div>
);
