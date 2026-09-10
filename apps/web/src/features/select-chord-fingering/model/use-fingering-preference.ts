import { useCallback, useEffect, useState } from 'react';
import type { ChordFingering } from '@cifra-hub/shared';
import {
  readFingeringPreference,
  saveFingeringPreference,
  subscribeFingeringPreference,
} from './fingering-preference';

export const useFingeringPreference = (
  normalizedSymbol: string,
  fingerings: readonly ChordFingering[],
) => {
  const readSelection = useCallback(
    () => readFingeringPreference(normalizedSymbol, fingerings) ?? fingerings[0]?.id ?? '',
    [fingerings, normalizedSymbol],
  );
  const [selectedId, setSelectedId] = useState(readSelection);

  useEffect(() => {
    setSelectedId(readSelection());
    return subscribeFingeringPreference(normalizedSymbol, () => {
      setSelectedId(readSelection());
    });
  }, [normalizedSymbol, readSelection]);

  const selectFingering = useCallback((fingeringId: string) => {
    setSelectedId(fingeringId);
    saveFingeringPreference(normalizedSymbol, fingeringId);
  }, [normalizedSymbol]);

  return { selectedId, selectFingering };
};
