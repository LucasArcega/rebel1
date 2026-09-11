import { slugToSearchName } from '@cifra-hub/shared';
import { GetSongBpmProviderError, lookupGetSongBpm } from '../../../entities/bpm/lib/getsongbpm-client.js';
import { env } from '../../../shared/config/env.js';
import { readBpmCache, writeBpmCache, writeBpmMissCache } from './bpm-cache.js';

export type BpmErrorCode =
  | 'BPM_NOT_FOUND'
  | 'BPM_PROVIDER_UNAVAILABLE'
  | 'INVALID_PARAMS'
  | 'BPM_NOT_CONFIGURED';

export class BpmRequestError extends Error {
  readonly code: BpmErrorCode;

  constructor(code: BpmErrorCode, message: string) {
    super(message);
    this.name = 'BpmRequestError';
    this.code = code;
  }
}

export const getBpm = async (params: {
  artist: string;
  song: string;
  artistName?: string;
  songName?: string;
}) => {
  if (!env.GETSONGBPM_API_KEY) {
    throw new BpmRequestError('BPM_NOT_CONFIGURED', 'GetSongBPM não está configurado neste ambiente');
  }

  const cached = readBpmCache(params.artist, params.song);
  if (cached === 'miss') {
    throw new BpmRequestError('BPM_NOT_FOUND', 'BPM não encontrado para esta música');
  }
  if (cached) {
    return cached;
  }

  const artistName = params.artistName?.trim() || slugToSearchName(params.artist);
  const songName = params.songName?.trim() || slugToSearchName(params.song);

  try {
    const result = await lookupGetSongBpm({
      apiKey: env.GETSONGBPM_API_KEY,
      baseUrl: env.GETSONGBPM_BASE_URL,
      artistName,
      songName,
    });

    if (!result) {
      writeBpmMissCache(params.artist, params.song);
      console.warn(`[bpm] miss artist=${params.artist} song=${params.song}`);
      throw new BpmRequestError('BPM_NOT_FOUND', 'BPM não encontrado para esta música');
    }

    writeBpmCache(params.artist, params.song, result);
    return result;
  } catch (error) {
    if (error instanceof BpmRequestError) {
      throw error;
    }

    if (error instanceof GetSongBpmProviderError || error instanceof Error) {
      console.warn(`[bpm] provider unavailable artist=${params.artist} song=${params.song}`);
      throw new BpmRequestError('BPM_PROVIDER_UNAVAILABLE', 'Serviço de BPM indisponível no momento');
    }

    throw error;
  }
};
