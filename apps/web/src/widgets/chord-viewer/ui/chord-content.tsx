import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { findFingerings, parseChordSymbol } from '@cifra-hub/shared';
import { ChordDiagram } from '@/entities/chord-diagram';
import type { FontSize } from '@/features/chord-display';
import {
  FingeringPicker,
  useFingeringPreference,
} from '@/features/select-chord-fingering';
import {
  cleanChordContent,
  isSectionHeaderLine,
  isTuningLine,
  splitChordLine,
} from '@/shared/lib/chord-highlight';

interface ChordContentProps {
  content: string;
  contentRef?: RefObject<HTMLDivElement | null>;
  fontSize?: FontSize;
  tuning?: string | null;
  diagramsEnabled?: boolean;
}

interface PopoverPosition {
  left: number;
  top: number;
  above: boolean;
}

const ChordToken = ({ symbol, tuning }: { symbol: string; tuning?: string | null }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverId = useId();
  const normalizedSymbol = parseChordSymbol(symbol)?.normalized ?? symbol;
  const fingerings = useMemo(() => findFingerings(symbol, tuning), [symbol, tuning]);
  const { selectedId, selectFingering } = useFingeringPreference(normalizedSymbol, fingerings);
  const [visible, setVisible] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const fingering = fingerings.find((item) => item.id === selectedId) ?? fingerings[0];

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = 176;
    const margin = 12;
    const above = rect.bottom + 230 > window.innerHeight && rect.top > 230;
    const idealLeft = rect.left + rect.width / 2;

    setPosition({
      left: Math.min(window.innerWidth - popoverWidth / 2 - margin, Math.max(popoverWidth / 2 + margin, idealLeft)),
      top: above ? rect.top - 8 : rect.bottom + 8,
      above,
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [updatePosition, visible]);

  useEffect(() => {
    if (!visible) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (anchorRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setVisible(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer, true);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer, true);
  }, [visible]);

  const cancelClose = () => {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const showPreview = () => {
    cancelClose();
    updatePosition();
    setVisible(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => setVisible(false), 140);
  };

  if (!fingering) return <span className="chord-token">{symbol}</span>;

  return (
    <>
      <button
        type="button"
        ref={anchorRef}
        className="chord-token chord-token--previewable"
        aria-label={`Acorde ${symbol}. Diagrama e variações disponíveis`}
        aria-expanded={visible}
        aria-controls={visible ? popoverId : undefined}
        onMouseEnter={showPreview}
        onMouseLeave={scheduleClose}
        onFocus={showPreview}
        onClick={showPreview}
        onKeyDown={(event) => {
          if (event.key === 'Tab' && !event.shiftKey && visible) {
            const action = popoverRef.current?.querySelector<HTMLButtonElement>('button');
            if (action) {
              event.preventDefault();
              action.focus();
            }
          }
          if (event.key === 'Escape') setVisible(false);
        }}
        onBlur={(event) => {
          if (!popoverRef.current?.contains(event.relatedTarget as Node | null)) scheduleClose();
        }}
      >
        {symbol}
      </button>
      {visible && position && typeof document !== 'undefined' && createPortal(
        <div
          ref={popoverRef}
          id={popoverId}
          className={`chord-token-popover${position.above ? ' chord-token-popover--above' : ''}`}
          style={{ left: position.left, top: position.top }}
          role="group"
          aria-label={`Diagrama e variações de ${symbol}`}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          onBlur={(event) => {
            const next = event.relatedTarget as Node | null;
            if (!popoverRef.current?.contains(next) && next !== anchorRef.current) scheduleClose();
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            setVisible(false);
            anchorRef.current?.focus();
          }}
        >
          <ChordDiagram symbol={symbol} fingering={fingering} size="sm" />
          <button
            type="button"
            className="chord-token-popover__variations"
            aria-haspopup="dialog"
            onClick={() => {
              setVisible(false);
              setPickerOpen(true);
            }}
          >
            {fingerings.length === 1 ? 'Ver detalhes' : `Ver ${fingerings.length} variações`}
          </button>
        </div>,
        document.body,
      )}
      {pickerOpen && typeof document !== 'undefined' && createPortal(
        <FingeringPicker
          symbol={symbol}
          fingerings={fingerings}
          selectedId={fingering.id}
          openerRef={anchorRef}
          onClose={() => setPickerOpen(false)}
          onSelect={selectFingering}
        />,
        document.body,
      )}
    </>
  );
};

const renderLineSegments = (line: string, tuning?: string | null, diagramsEnabled = true) =>
  splitChordLine(line).map((segment, index) =>
    segment.type === 'chord' ? (
      diagramsEnabled
        ? <ChordToken key={index} symbol={segment.value} tuning={tuning} />
        : <span key={index} className="chord-token">{segment.value}</span>
    ) : (
      <Fragment key={index}>{segment.value}</Fragment>
    ),
  );

export const ChordContent = ({
  content,
  contentRef,
  fontSize = 'md',
  tuning = null,
  diagramsEnabled = true,
}: ChordContentProps) => {
  const lines = cleanChordContent(content).split('\n');

  return (
    <div ref={contentRef} className="chord-content-area">
      <div className={`chord-content chord-content--${fontSize}`} id="chord-print-area">
        {lines.map((line, index) => {
          if (!line.trim()) {
            return <div key={index} className="chord-line chord-line--spacer" aria-hidden="true" />;
          }

          if (isSectionHeaderLine(line) || isTuningLine(line)) {
            return (
              <div key={index} className="chord-line chord-line--section">
                {line.trim()}
              </div>
            );
          }

          return (
            <div key={index} className="chord-line">
              {renderLineSegments(line, tuning, diagramsEnabled)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
