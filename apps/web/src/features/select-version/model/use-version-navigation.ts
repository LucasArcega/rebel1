import { useNavigate } from 'react-router-dom';
import type { ChordVersion, InstrumentSlug } from '@/entities/chord';

export const useVersionNavigation = (artistSlug: string, songSlug: string) => {
  const navigate = useNavigate();

  const selectVersion = (version: ChordVersion) => {
    const instrument = version.instrumentSlug !== 'cifra-group' ? version.instrumentSlug : undefined;
    const query = instrument ? `?instrument=${instrument}` : '';
    navigate(`/artists/${artistSlug}/songs/${songSlug}${query}`);
  };

  return { selectVersion };
};

export const parseInstrumentFromSearch = (search: string): InstrumentSlug | undefined => {
  const value = new URLSearchParams(search).get('instrument');
  return value ? (value as InstrumentSlug) : undefined;
};
