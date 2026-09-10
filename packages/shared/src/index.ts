export type { ChordOccurrence, ChordSong, ChordVersion, InstrumentSlug } from './chord/types.js';
export { buildFetchUrl, buildVersionPath, parseCifraClubHtml } from './chord/parser.js';
export type { SearchResult } from './search/types.js';
export { searchSongs } from './search/solr-client.js';

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
