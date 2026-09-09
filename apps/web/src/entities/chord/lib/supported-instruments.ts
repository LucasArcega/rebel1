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

const LIMITED_INSTRUMENTS = new Set<InstrumentSlug>(['sheet', 'guitarpro']);

export const isInstrumentSupported = (instrumentSlug: InstrumentSlug) =>
  SUPPORTED_INSTRUMENTS.has(instrumentSlug);

export const isInstrumentLimited = (instrumentSlug: InstrumentSlug) =>
  LIMITED_INSTRUMENTS.has(instrumentSlug);

export const isVersionSelectable = (version: ChordVersion) => {
  if (isInstrumentSupported(version.instrumentSlug)) return true;
  if (isInstrumentLimited(version.instrumentSlug)) return false;
  return false;
};

export const getVersionSupportLabel = (version: ChordVersion) => {
  if (isInstrumentLimited(version.instrumentSlug)) return 'Formato ainda não suportado';
  if (version.instrumentSlug === 'keyboard') return 'Disponível quando listado pelo Cifra Club';
  return undefined;
};
