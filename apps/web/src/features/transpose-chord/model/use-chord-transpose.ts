import { useMemo, useState } from 'react';
import type { ChordSong } from '@/entities/chord';
import {
  computeTransposeSemitones,
  formatDisplayedTone,
  hasTransposableChords,
  transposeContent,
} from '@/shared/lib/chord-transpose';

export const useChordTranspose = (chord: ChordSong) => {
  const [manualSemitones, setManualSemitones] = useState(0);
  const [capoFret, setCapoFret] = useState(0);

  const canTranspose = useMemo(
    () => hasTransposableChords(chord.content),
    [chord.content],
  );

  const effectiveSemitones = computeTransposeSemitones(manualSemitones, capoFret);

  const displayContent = useMemo(
    () => (canTranspose ? transposeContent(chord.content, effectiveSemitones) : chord.content),
    [canTranspose, chord.content, effectiveSemitones],
  );

  const displayTone = useMemo(
    () => formatDisplayedTone(chord.tone, effectiveSemitones),
    [chord.tone, effectiveSemitones],
  );

  const increase = () => setManualSemitones((value) => value + 1);
  const decrease = () => setManualSemitones((value) => value - 1);
  const reset = () => {
    setManualSemitones(0);
    setCapoFret(0);
  };

  return {
    canTranspose,
    manualSemitones,
    capoFret,
    effectiveSemitones,
    displayContent,
    displayTone,
    setCapoFret,
    increase,
    decrease,
    reset,
  };
};
