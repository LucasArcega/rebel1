import { findBassVersionId } from '@cifra-hub/shared';
import { buildFetchUrl, buildVersionPath, parseCifraClubHtml } from '../../../entities/chord/lib/parser.js';
import type { InstrumentSlug } from '../../../entities/chord/model/types.js';
import { env } from '../../../shared/config/env.js';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

export type ChordErrorCode = 'NOT_FOUND_ON_CC' | 'PARSE_FAILED' | 'FETCH_FAILED';

export class ChordRequestError extends Error {
  readonly code: ChordErrorCode;

  constructor(code: ChordErrorCode, message: string) {
    super(message);
    this.name = 'ChordRequestError';
    this.code = code;
  }
}

/** @deprecated Use ChordRequestError */
export class ChordNotFoundError extends ChordRequestError {
  constructor(message = 'Cifra não encontrada') {
    super('NOT_FOUND_ON_CC', message);
    this.name = 'ChordNotFoundError';
  }
}

export const getChord = async (params: {
  artist: string;
  song: string;
  instrument?: InstrumentSlug;
  version?: string;
}) => {
  const selectedInstrument = params.instrument ?? 'cifra-group';
  const url = buildFetchUrl(
    env.CIFRACLUB_BASE_URL,
    params.artist,
    params.song,
    params.instrument,
    params.version,
  );

  const bassVersionPromise = selectedInstrument === 'cifra-group'
    ? findBassVersionId(params.artist, params.song).catch((error) => {
        console.warn(
          `[versions] bass discovery failed artist=${params.artist} song=${params.song}`,
          error,
        );
        return null;
      })
    : Promise.resolve(null);
  const [response, indexedBassVersionId] = await Promise.all([
    fetch(url, { headers: BROWSER_HEADERS }),
    bassVersionPromise,
  ]);

  if (response.status === 404) {
    throw new ChordRequestError('NOT_FOUND_ON_CC', 'Transcrição não disponível no Cifra Club');
  }

  if (!response.ok) {
    throw new ChordRequestError('FETCH_FAILED', `Falha ao buscar cifra: ${response.status}`);
  }

  const html = await response.text();
  const parsed = parseCifraClubHtml(
    html,
    params.artist,
    params.song,
    env.CIFRACLUB_BASE_URL,
    selectedInstrument,
    params.version ?? 'principal',
  );

  if (!parsed) {
    console.warn(
      `[parser] PARSE_FAILED artist=${params.artist} song=${params.song} instrument=${params.instrument ?? 'cifra-group'} version=${params.version ?? 'principal'}`,
    );
    throw new ChordRequestError(
      'PARSE_FAILED',
      'Este instrumento ou versão ainda não é suportado pelo parser',
    );
  }

  if (
    indexedBassVersionId &&
    !parsed.versions.some((version) => version.instrumentSlug === 'bass')
  ) {
    parsed.versions.push({
      id: indexedBassVersionId,
      label: 'Principal',
      labelSlug: 'principal',
      instrument: 'Baixo',
      instrumentSlug: 'bass',
      path: buildVersionPath(params.artist, params.song, 'bass', 'principal'),
    });
  }

  return parsed;
};
