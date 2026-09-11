import { useEffect, useRef } from 'react';
import { calculateTapTempoBpm } from '@cifra-hub/shared';

const TAP_RESET_MS = 2_000;

export const useTapTempo = (onBpm: (bpm: number) => void) => {
  const tapsRef = useRef<number[]>([]);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
  }, []);

  const tap = () => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current, now];

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    const bpm = calculateTapTempoBpm(tapsRef.current);
    if (bpm !== null) {
      onBpm(bpm);
    }

    resetTimerRef.current = window.setTimeout(() => {
      tapsRef.current = [];
      resetTimerRef.current = null;
    }, TAP_RESET_MS);
  };

  return { tap };
};
