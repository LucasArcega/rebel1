import { Fragment, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
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
import { Button, Popover } from '@/shared/ui';

interface ChordContentProps {
  content: string;
  contentRef?: RefObject<HTMLDivElement | null>;
  fontSize?: FontSize;
  tuning?: string | null;
  diagramsEnabled?: boolean;
}

const ChordToken = ({ symbol, tuning }: { symbol: string; tuning?: string | null }) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const normalizedSymbol = parseChordSymbol(symbol)?.normalized ?? symbol;
  const fingerings = useMemo(() => findFingerings(symbol, tuning), [symbol, tuning]);
  const { selectedId, selectFingering } = useFingeringPreference(normalizedSymbol, fingerings);
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerOpenRef = useRef(false);
  const skipFocusOpenRef = useRef(false);
  const fingering = fingerings.find((item) => item.id === selectedId) ?? fingerings[0];

  const openPicker = () => {
    pickerOpenRef.current = true;
    setOpen(false);
    setPickerOpen(true);
  };

  const closePicker = () => {
    skipFocusOpenRef.current = true;
    pickerOpenRef.current = false;
    setPickerOpen(false);
  };

  if (!fingering) return <span className="chord-token">{symbol}</span>;

  return (
    <>
      <Popover
        open={open && !pickerOpen}
        onOpenChange={(next) => {
          if (pickerOpenRef.current) {
            setOpen(false);
            return;
          }
          setOpen(next);
        }}
      >
        <Popover.Trigger
          ref={anchorRef}
          className="chord-token chord-token--previewable"
          aria-label={`Acorde ${symbol}. Diagrama e variações disponíveis`}
          openOnHover={!pickerOpen}
          delay={0}
          closeDelay={140}
          onFocus={() => {
            if (skipFocusOpenRef.current) {
              skipFocusOpenRef.current = false;
              return;
            }
            if (!pickerOpenRef.current) setOpen(true);
          }}
        >
          {symbol}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner side="top" align="center">
            <Popover.Popup
              className="chord-token-popover"
              role="group"
              aria-label={`Diagrama e variações de ${symbol}`}
            >
              <ChordDiagram symbol={symbol} fingering={fingering} size="sm" />
              <Button
                type="button"
                variant="secondary"
                size="compact"
                className="chord-token-popover__variations"
                aria-haspopup="dialog"
                onClick={openPicker}
              >
                {fingerings.length === 1 ? 'Ver detalhes' : `Ver ${fingerings.length} variações`}
              </Button>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover>
      {pickerOpen && (
        <FingeringPicker
          symbol={symbol}
          fingerings={fingerings}
          selectedId={fingering.id}
          openerRef={anchorRef}
          onClose={closePicker}
          onSelect={selectFingering}
        />
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
