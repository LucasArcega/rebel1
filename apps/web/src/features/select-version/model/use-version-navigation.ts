import { useNavigate } from 'react-router-dom';
import type { ChordVersion, InstrumentSlug } from '@/entities/chord';

const buildSongSearch = (instrument?: InstrumentSlug, version?: string) => {
  const params = new URLSearchParams();

  if (instrument) {
    params.set('instrument', instrument);
  }

  if (version && version !== 'principal') {
    params.set('version', version);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const useVersionNavigation = (artistSlug: string, songSlug: string) => {
  const navigate = useNavigate();

  const selectVersion = (version: ChordVersion) => {
    const instrument = version.instrumentSlug !== 'cifra-group' ? version.instrumentSlug : undefined;
    const query = buildSongSearch(instrument, version.labelSlug);
    navigate(`/artists/${artistSlug}/songs/${songSlug}${query}`);
  };

  return { selectVersion };
};

export const parseInstrumentFromSearch = (search: string): InstrumentSlug | undefined => {
  const value = new URLSearchParams(search).get('instrument');
  return value ? (value as InstrumentSlug) : undefined;
};

export const parseVersionFromSearch = (search: string): string | undefined => {
  const value = new URLSearchParams(search).get('version');
  return value ?? undefined;
};
