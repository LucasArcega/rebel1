import type { ChordVersion, InstrumentSlug } from '../model/types';

const SUPPORTED_INSTRUMENTS = new Set<InstrumentSlug>([
  'cifra-group',
  'lyrics',
  'bass',
  'drums',
  'harmonica',
  'guitar',
  'keyboard',
  'ukulele',
  'viola',
]);

export const isInstrumentSupported = (instrumentSlug: InstrumentSlug) =>
  SUPPORTED_INSTRUMENTS.has(instrumentSlug);

export const isVersionSelectable = (version: ChordVersion) =>
  isInstrumentSupported(version.instrumentSlug);
