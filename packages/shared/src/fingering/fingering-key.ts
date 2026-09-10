export const STANDARD_GUITAR_TUNING_KEY = 'E-A-D-G-B-E';

export const fingeringPreferenceStorageKey = (
  normalizedSymbol: string,
  instrument: 'guitar' = 'guitar',
  tuningKey: string = STANDARD_GUITAR_TUNING_KEY,
): string => `chord-fingering/${instrument}/${tuningKey}/${normalizedSymbol}`;
