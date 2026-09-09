import { env } from '@/shared/config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const httpClient = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ error: response.statusText }))) as {
      error?: string;
      code?: string;
    };
    throw new ApiError(body.error ?? 'Erro na requisição', response.status, body.code);
  }

  return response.json() as Promise<T>;
};
