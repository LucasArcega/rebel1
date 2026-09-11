import { useEffect, useRef, useState } from 'react';
import { calculateTapTempoBpm } from '@cifra-hub/shared';

const TAP_RESET_MS = 2_000;

export const useTapTempo = (onBpm: (bpm: number) => void) => {
  const onBpmRef = useRef(onBpm);
  const tapsRef = useRef<number[]>([]);
  const resetTimerRef = useRef<number | null>(null);
  const [tapCount, setTapCount] = useState(0);

  onBpmRef.current = onBpm;

  useEffect(() => () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
  }, []);

  const tap = () => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current, now];
    setTapCount(tapsRef.current.length);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    const bpm = calculateTapTempoBpm(tapsRef.current);
    if (bpm !== null) {
      onBpmRef.current(bpm);
    }

    resetTimerRef.current = window.setTimeout(() => {
      tapsRef.current = [];
      setTapCount(0);
      resetTimerRef.current = null;
    }, TAP_RESET_MS);
  };

  return { tap, tapCount };
};
