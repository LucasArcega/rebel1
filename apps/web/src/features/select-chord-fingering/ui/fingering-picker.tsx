import { useEffect, useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import type { ChordFingering } from '@cifra-hub/shared';
import { ChordDiagram } from '@/entities/chord-diagram';

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

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const FingeringPicker = ({ symbol, fingerings, selectedId, openerRef, onSelect, onClose }: FingeringPickerProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();

    const focusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
        .filter((element) => !element.hasAttribute('disabled') && element.tabIndex >= 0);

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        openerRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, openerRef]);

  const close = () => {
    onClose();
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  const navigateGrid = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const options = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
    const current = options.indexOf(event.currentTarget);
    const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    event.preventDefault();
    options[(current + direction + options.length) % options.length]?.focus();
  };

  return (
    <div className="fingering-picker__backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) close();
    }}>
      <div
        ref={dialogRef}
        className={`fingering-picker${fingerings.length === 1 ? ' fingering-picker--compact' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`Variações de ${symbol}`}
      >
        <header className="fingering-picker__header">
          <div>
            <h2>Variações de {symbol}</h2>
            <p>{fingerings.length === 1 ? '1 forma disponível' : `${fingerings.length} formas disponíveis`}</p>
          </div>
          <button type="button" className="fingering-picker__close" onClick={close} aria-label="Fechar variações">×</button>
        </header>
        <div className="fingering-picker__grid" role="radiogroup" aria-label={`Formas de ${symbol}`}>
          {fingerings.map((fingering, index) => {
            const selected = fingering.id === selectedId;
            return (
              <button type="button" key={fingering.id} role="radio" aria-checked={selected}
                tabIndex={selected || (!selectedId && index === 0) ? 0 : -1}
                className={`fingering-option${selected ? ' fingering-option--selected' : ''}`}
                aria-label={`Selecionar variação ${index + 1} de ${symbol}`}
                onKeyDown={navigateGrid} onClick={() => onSelect(fingering.id)}>
                <ChordDiagram symbol={symbol} fingering={fingering} size="sm" showTitle={false} />
                <span className="fingering-option__meta">Posição {fingering.baseFret} · Dificuldade {fingering.difficulty}/5</span>
                {fingering.tags.length > 0 && (
                  <span className="fingering-option__tags">{fingering.tags.map((tag) => TAG_LABELS[tag] ?? tag).join(' · ')}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
