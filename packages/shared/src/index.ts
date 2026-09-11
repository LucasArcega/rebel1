export type { ChordOccurrence, ChordSong, ChordVersion, InstrumentSlug } from './chord/types.js';
export { buildFetchUrl, buildVersionPath, parseCifraClubHtml } from './chord/parser.js';
export type { SearchResult } from './search/types.js';
export { findBassVersionId, searchSongs } from './search/solr-client.js';

export type { ChordAlteration, ChordQuality, NoteName, ParsedChordSymbol } from './harmony/chord-symbol.js';
export { parseChordSymbol } from './harmony/chord-symbol.js';
export { NOTE_TO_PITCH_CLASS, getChordFormula } from './harmony/chord-formula.js';
export type { ChordFormula } from './harmony/chord-formula.js';
export { extractBoldChordOccurrences, extractChordOccurrences } from './harmony/extract-chords.js';
export {
  computeTransposeSemitones,
  formatDisplayedTone,
  hasTransposableChords,
  transposeChord,
  transposeChordOccurrences,
  transposeContent,
} from './harmony/transpose.js';

export type { Barre, ChordFingering, FingeringTag, FingeringValidation, GuitarTuning, StringFret } from './fingering/types.js';
export { GUITAR_STANDARD_TUNING } from './fingering/types.js';
export { computeBaseFret } from './fingering/base-fret.js';
export { fingeringPreferenceStorageKey, STANDARD_GUITAR_TUNING_KEY } from './fingering/fingering-key.js';
export { validateFingering } from './fingering/validate-fingering.js';
export { findFingerings, isStandardGuitarTuning } from './fingering/find-fingerings.js';

export type {
  BpmLookupSource,
  BpmSource,
  GetSongBpmHit,
  GetSongBpmLookupResult,
} from './bpm/types.js';
export {
  DEFAULT_BPM,
  DEFAULT_LINES_PER_BEAT,
  GETSONGBPM_ATTRIBUTION,
  LINES_PER_BEAT_STEP,
  MAX_BPM,
  MAX_LINES_PER_BEAT,
  MAX_PROVIDER_BPM,
  MIN_BPM,
  MIN_LINES_PER_BEAT,
  MIN_PROVIDER_BPM,
} from './bpm/types.js';
export { normalizeSearchText, scoreNameMatch, scoreSongMatch, slugToSearchName } from './bpm/normalize-search.js';
export { beatIntervalMs, calculateTapTempoBpm, clampBpm, clampLinesPerBeat, scrollPerBeat } from './bpm/scroll-bpm.js';
export {
  GetSongBpmProviderError,
  lookupGetSongBpm,
  parseGetSongSearchPayload,
  pickBestGetSongMatch,
  searchGetSongBpm,
} from './bpm/getsongbpm-client.js';
