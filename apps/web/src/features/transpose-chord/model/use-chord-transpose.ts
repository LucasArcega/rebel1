import { useMemo, useState } from 'react';
import { extractChordOccurrences, transposeChordOccurrences } from '@cifra-hub/shared';
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

  const originalChordOccurrences = useMemo(
    () => chord.chords?.length ? chord.chords : extractChordOccurrences(chord.content),
    [chord.chords, chord.content],
  );
  const canTranspose = originalChordOccurrences.length > 0 || hasTransposableChords(chord.content);

  const effectiveSemitones = computeTransposeSemitones(manualSemitones, capoFret);

  const displayContent = useMemo(
    () => (canTranspose ? transposeContent(chord.content, effectiveSemitones) : chord.content),
    [canTranspose, chord.content, effectiveSemitones],
  );

  const displayTone = useMemo(
    () => formatDisplayedTone(chord.tone, effectiveSemitones),
    [chord.tone, effectiveSemitones],
  );
  const chordOccurrences = useMemo(
    () => transposeChordOccurrences(originalChordOccurrences, effectiveSemitones),
    [effectiveSemitones, originalChordOccurrences],
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
    chordOccurrences,
    setCapoFret,
    increase,
    decrease,
    reset,
  };
};
