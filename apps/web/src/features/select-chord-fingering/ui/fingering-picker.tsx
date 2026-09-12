import { useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import type { ChordFingering } from '@cifra-hub/shared';
import { ChordDiagram } from '@/entities/chord-diagram';
import { Dialog, IconButton } from '@/shared/ui';

interface FingeringPickerProps {
  symbol: string;
  fingerings: readonly ChordFingering[];
  selectedId: string;
  openerRef: RefObject<HTMLElement | null>;
  onSelect: (fingeringId: string) => void;
  onClose: () => void;
}

const TAG_LABELS: Record<string, string> = {
  open: 'aberto', barre: 'pestana', movable: 'móvel', inversion: 'inversão', compact: 'compacto',
};

export const FingeringPicker = ({
  symbol,
  fingerings,
  selectedId,
  openerRef,
  onSelect,
  onClose,
}: FingeringPickerProps) => {
  const compact = fingerings.length === 1;
  const selectedRef = useRef<HTMLButtonElement>(null);

  const navigateGrid = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const options = Array.from(event.currentTarget.closest('[role="radiogroup"]')?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
    const current = options.indexOf(event.currentTarget);
    const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    event.preventDefault();
    options[(current + direction + options.length) % options.length]?.focus();
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup
            size={compact ? 'compact' : 'default'}
            className="fingering-picker"
            initialFocus={selectedRef}
            finalFocus={openerRef}
          >
            <header className="fingering-picker__header">
              <div>
                <Dialog.Title>Variações de {symbol}</Dialog.Title>
                <Dialog.Description>
                  {fingerings.length === 1 ? '1 forma disponível' : `${fingerings.length} formas disponíveis`}
                </Dialog.Description>
              </div>
              <Dialog.Close render={<IconButton aria-label="Fechar variações" variant="secondary">×</IconButton>} />
            </header>
            <div className="fingering-picker__grid" role="radiogroup" aria-label={`Formas de ${symbol}`}>
              {fingerings.map((fingering, index) => {
                const selected = fingering.id === selectedId;
                return (
                  <button
                    type="button"
                    key={fingering.id}
                    ref={selected ? selectedRef : undefined}
                    role="radio"
                    aria-checked={selected}
                    tabIndex={selected || (!selectedId && index === 0) ? 0 : -1}
                    className={`fingering-option${selected ? ' fingering-option--selected' : ''}`}
                    aria-label={`Selecionar variação ${index + 1} de ${symbol}`}
                    onKeyDown={navigateGrid}
                    onClick={() => onSelect(fingering.id)}
                  >
                    <ChordDiagram symbol={symbol} fingering={fingering} size="sm" showTitle={false} />
                    <span className="fingering-option__meta">Posição {fingering.baseFret} · Dificuldade {fingering.difficulty}/5</span>
                    {fingering.tags.length > 0 && (
                      <span className="fingering-option__tags">{fingering.tags.map((tag) => TAG_LABELS[tag] ?? tag).join(' · ')}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog>
  );
};
