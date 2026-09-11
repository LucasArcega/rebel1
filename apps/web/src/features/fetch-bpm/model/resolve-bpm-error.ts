import { ApiError } from '@/shared/api/http-client';

export const resolveBpmErrorMessage = (error: unknown): string | null => {
  if (!error) {
    return null;
  }

  if (error instanceof ApiError) {
    if (error.code === 'BPM_NOT_FOUND' || error.status === 404) {
      return 'BPM não encontrado — use tap ou informe manualmente';
    }

    if (error.code === 'BPM_NOT_CONFIGURED' || error.status === 501) {
      return 'BPM não configurado — use tap ou informe manualmente';
    }
  }

  return 'Erro ao buscar BPM — use tap ou informe manualmente';
};
