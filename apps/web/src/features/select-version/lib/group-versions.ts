import type { ChordVersion, InstrumentSlug } from '@/entities/chord';

export interface InstrumentVersionGroup {
  instrument: string;
  instrumentSlug: InstrumentSlug;
  versions: ChordVersion[];
}

export const groupVersionsByInstrument = (versions: ChordVersion[]): InstrumentVersionGroup[] => {
  const groups: InstrumentVersionGroup[] = [];

  for (const version of versions) {
    const existing = groups.find((group) => group.instrumentSlug === version.instrumentSlug);
    if (existing) {
      existing.versions.push(version);
      continue;
    }

    groups.push({
      instrument: version.instrument,
      instrumentSlug: version.instrumentSlug,
      versions: [version],
    });
  }

  return groups;
};
