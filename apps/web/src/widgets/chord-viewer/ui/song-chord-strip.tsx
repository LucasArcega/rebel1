import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChordFingering, ChordOccurrence } from '@cifra-hub/shared';
import { findFingerings, isStandardGuitarTuning, parseChordSymbol } from '@cifra-hub/shared';
import { ChordDiagram } from '@/entities/chord-diagram';
import {
  FingeringPicker,
  readFingeringPreference,
  saveFingeringPreference,
} from '@/features/select-chord-fingering';
import { uniqueChordOccurrences } from '../lib/unique-chord-occurrences';

export interface SongChordStripProps {
  chords: readonly ChordOccurrence[];
  tuning: string | null;
  disabledReason?: string;
}

interface PickerState {
  symbol: string;
  fingerings: readonly ChordFingering[];
  selectedId: string;
  opener: HTMLButtonElement;
  select: (fingeringId: string) => void;
}

const ChordCard = ({
  occurrence,
  tuning,
  onOpen,
}: {
  occurrence: ChordOccurrence;
  tuning: string | null;
  onOpen: (state: PickerState) => void;
}) => {
  const parsed = parseChordSymbol(occurrence.symbol);
  const normalizedSymbol = parsed?.normalized ?? occurrence.normalizedSymbol;
  const fingerings = useMemo(
    () => findFingerings(occurrence.symbol, tuning),
    [occurrence.symbol, tuning],
  );
  const [selectedId, setSelectedId] = useState(() =>
    readFingeringPreference(normalizedSymbol, fingerings) ?? fingerings[0]?.id ?? '',
  );
  const openerRef = useRef<HTMLButtonElement>(null);
  const selected = fingerings.find((fingering) => fingering.id === selectedId) ?? fingerings[0];

  const openPicker = () => {
    if (!selected || !openerRef.current) return;
    onOpen({
      symbol: occurrence.symbol,
      fingerings,
      selectedId: selected.id,
      opener: openerRef.current,
      select: (fingeringId) => {
        setSelectedId(fingeringId);
        saveFingeringPreference(normalizedSymbol, fingeringId);
      },
    });
  };

  if (!selected) {
    return (
      <article className="song-chord-card song-chord-card--unavailable">
        <h3>{occurrence.symbol}</h3>
        <p>Diagrama indisponível</p>
      </article>
    );
  }

  return (
    <article className="song-chord-card">
      <ChordDiagram symbol={occurrence.symbol} fingering={selected} size="sm" />
      <button
        ref={openerRef}
        type="button"
        className="song-chord-card__variations"
        onClick={openPicker}
        aria-label={`Ver variações de ${occurrence.symbol}`}
      >
        {fingerings.length === 1 ? 'Ver detalhes' : `${fingerings.length} formas`}
      </button>
    </article>
  );
};

export const SongChordStrip = ({ chords, tuning, disabledReason }: SongChordStripProps) => {
  const [picker, setPicker] = useState<PickerState | null>(null);
  const uniqueChords = useMemo(() => uniqueChordOccurrences(chords), [chords]);
  const supportedTuning = tuning === null || isStandardGuitarTuning(tuning);
  const stripKey = uniqueChords.map((chord) => chord.normalizedSymbol || chord.symbol).join('|');

  useEffect(() => {
    setPicker(null);
  }, [stripKey]);

  if (uniqueChords.length === 0) return null;

  if (disabledReason || !supportedTuning) {
    return (
      <aside className="song-chord-strip song-chord-strip--notice" aria-label="Acordes desta música">
        <p>{disabledReason ?? 'Diagramas indisponíveis para esta afinação'}</p>
      </aside>
    );
  }

  return (
    <section className="song-chord-strip" aria-label="Acordes desta música">
      <div className="song-chord-strip__heading">
        <h2>Acordes desta música</h2>
        <span>{uniqueChords.length} {uniqueChords.length === 1 ? 'acorde' : 'acordes'}</span>
      </div>
      <div className="song-chord-strip__list">
        {uniqueChords.map((occurrence) => (
          <ChordCard
            key={occurrence.normalizedSymbol || occurrence.symbol}
            occurrence={occurrence}
            tuning={tuning}
            onOpen={setPicker}
          />
        ))}
      </div>
      {picker && (
        <FingeringPicker
          symbol={picker.symbol}
          fingerings={picker.fingerings}
          selectedId={picker.selectedId}
          openerRef={{ current: picker.opener }}
          onClose={() => setPicker(null)}
          onSelect={(fingeringId) => {
            picker.select(fingeringId);
            setPicker({ ...picker, selectedId: fingeringId });
          }}
        />
      )}
    </section>
  );
};
