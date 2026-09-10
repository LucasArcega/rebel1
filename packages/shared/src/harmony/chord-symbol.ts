export type NaturalNote = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type NoteName = `${NaturalNote}` | `${NaturalNote}#` | `${NaturalNote}b`;

export type ChordQuality =
  | 'major'
  | 'minor'
  | 'power'
  | 'diminished'
  | 'half-diminished'
  | 'augmented'
  | 'suspended2'
  | 'suspended4';

export interface ChordAlteration {
  accidental: 'b' | '#';
  degree: 5 | 9 | 11 | 13;
}

export interface ParsedChordSymbol {
  raw: string;
  normalized: string;
  root: NoteName;
  quality: ChordQuality;
  extensions: number[];
  alterations: ChordAlteration[];
  additions: number[];
  omissions: number[];
  bass: NoteName | null;
}

const ROOT_PATTERN = '[A-G](?:#|b)?';
const NOTE_PATTERN = /^[A-G](?:#|b)?$/;
const ALTERATION_DEGREES = new Set([5, 9, 11, 13]);

const parseNote = (value: string): NoteName | null =>
  NOTE_PATTERN.test(value) ? (value as NoteName) : null;

const pushUnique = (target: number[], value: number) => {
  if (!target.includes(value)) target.push(value);
};

/** Parse a complete chord symbol. Partial matches are deliberately rejected. */
export const parseChordSymbol = (input: string): ParsedChordSymbol | null => {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;

  const slash = raw.lastIndexOf('/');
  const body = slash === -1 ? raw : raw.slice(0, slash);
  const bassText = slash === -1 ? null : raw.slice(slash + 1);
  if (slash !== raw.indexOf('/') || (bassText !== null && !bassText)) return null;

  const bass = bassText === null ? null : parseNote(bassText);
  if (bassText !== null && !bass) return null;

  const rootMatch = body.match(new RegExp(`^(${ROOT_PATTERN})`));
  if (!rootMatch) return null;

  const root = rootMatch[1] as NoteName;
  let suffix = body.slice(root.length);
  let quality: ChordQuality = 'major';
  let qualityKey = '';
  let majorSeventh = false;
  const extensions: number[] = [];
  const alterations: ChordAlteration[] = [];
  const additions: number[] = [];
  const omissions: number[] = [];

  if (suffix.startsWith('maj')) {
    suffix = suffix.slice(3);
    qualityKey = 'maj';
  } else if (suffix.startsWith('min')) {
    suffix = suffix.slice(3);
    quality = 'minor';
    qualityKey = 'm';
  } else if (suffix.startsWith('dim')) {
    suffix = suffix.slice(3);
    quality = 'diminished';
    qualityKey = 'dim';
  } else if (suffix.startsWith('aug')) {
    suffix = suffix.slice(3);
    quality = 'augmented';
    qualityKey = 'aug';
  } else if (suffix.startsWith('sus2')) {
    suffix = suffix.slice(4);
    quality = 'suspended2';
    qualityKey = 'sus2';
  } else if (suffix.startsWith('sus4')) {
    suffix = suffix.slice(4);
    quality = 'suspended4';
    qualityKey = 'sus4';
  } else if (suffix.startsWith('sus')) {
    suffix = suffix.slice(3);
    quality = 'suspended4';
    qualityKey = 'sus4';
  } else if (suffix.startsWith('m')) {
    suffix = suffix.slice(1);
    quality = 'minor';
    qualityKey = 'm';
  } else if (suffix.startsWith('M')) {
    suffix = suffix.slice(1);
    qualityKey = 'maj';
  } else if (suffix.startsWith('+')) {
    suffix = suffix.slice(1);
    quality = 'augmented';
    qualityKey = 'aug';
  } else if (suffix.startsWith('°')) {
    suffix = suffix.slice(1);
    quality = 'diminished';
    qualityKey = 'dim';
  } else if (suffix.startsWith('ø')) {
    suffix = suffix.slice(1);
    quality = 'half-diminished';
    qualityKey = 'm7b5';
    pushUnique(extensions, 7);
  }

  // `maj7`/`M7` are major-seventh aliases, while bare `maj` is just major.
  if (qualityKey === 'maj' && suffix.startsWith('7')) {
    majorSeventh = true;
    suffix = suffix.slice(1);
    pushUnique(extensions, 7);
  }

  const tokens: string[] = [];
  while (suffix) {
    if (suffix.startsWith('(')) {
      const end = suffix.indexOf(')');
      if (end < 0) return null;
      const inner = suffix.slice(1, end);
      if (!inner || inner.includes('(')) return null;
      tokens.push(...inner.split(',').map((item) => item.trim()));
      suffix = suffix.slice(end + 1);
      continue;
    }

    const token = suffix.match(/^(?:add(?:2|4|9|11)|no(?:3|5)|(?:b|#)(?:5|9|11|13)|7M|(?:2|5|6|7|9|11|13)|sus[24])/)?.[0];
    if (!token) return null;
    tokens.push(token);
    suffix = suffix.slice(token.length);
  }

  let suspensionKey = '';
  for (let token of tokens) {
    // Common Brazilian notation uses 11+ for #11.
    token = token.replace(/^(5|9|11|13)\+$/, '#$1');
    if (token === '7M') {
      majorSeventh = true;
      pushUnique(extensions, 7);
      continue;
    }
    if (/^sus[24]$/.test(token)) {
      quality = token === 'sus2' ? 'suspended2' : 'suspended4';
      suspensionKey = token;
    } else if (/^add/.test(token)) {
      pushUnique(additions, Number(token.slice(3)));
    } else if (/^no/.test(token)) {
      pushUnique(omissions, Number(token.slice(2)));
    } else if (/^[b#]/.test(token)) {
      const degree = Number(token.slice(1));
      if (!ALTERATION_DEGREES.has(degree)) return null;
      alterations.push({ accidental: token[0] as 'b' | '#', degree: degree as 5 | 9 | 11 | 13 });
    } else {
      const degree = Number(token);
      if (![2, 5, 6, 7, 9, 11, 13].includes(degree)) return null;
      if (degree === 2) {
        pushUnique(additions, 2);
        continue;
      }
      if (degree === 5 && qualityKey === '') {
        quality = 'power';
        qualityKey = '5';
      }
      pushUnique(extensions, degree);
    }
  }

  extensions.sort((a, b) => a - b);
  additions.sort((a, b) => a - b);
  omissions.sort((a, b) => a - b);
  alterations.sort((a, b) => a.degree - b.degree || a.accidental.localeCompare(b.accidental));

  let normalizedSuffix = suspensionKey || qualityKey;
  if (majorSeventh) normalizedSuffix = 'maj7';
  for (const extension of extensions) {
    if (extension === 5 && normalizedSuffix === '5') continue;
    if (extension === 7 && (majorSeventh || quality === 'half-diminished')) continue;
    normalizedSuffix += extension;
  }
  normalizedSuffix += additions.map((degree) => `add${degree}`).join('');
  normalizedSuffix += alterations.map(({ accidental, degree }) => `${accidental}${degree}`).join('');
  normalizedSuffix += omissions.map((degree) => `no${degree}`).join('');

  return {
    raw,
    normalized: `${root}${normalizedSuffix}${bass ? `/${bass}` : ''}`,
    root,
    quality,
    extensions,
    alterations,
    additions,
    omissions,
    bass,
  };
};
