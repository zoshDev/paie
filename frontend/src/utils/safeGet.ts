import type { AxiosResponse } from 'axios';
import {api}from '@/services/api/config'; // ton instance Axios

export async function safeGet<T>(endpoint: string): Promise<T[] | []> {
  try {
    const response: AxiosResponse = await api.get(endpoint);

    const raw = response.data;
    return Array.isArray(raw) ? raw : [];
  } catch (error: any) {
    const raw = error?.response?.data;

    const isPydanticError =
      typeof raw === 'object' &&
      raw !== null &&
      'detail' in raw &&
      Array.isArray(raw.detail);

    if (isPydanticError) {
      console.warn(`[🛑 ${endpoint}] Erreur Pydantic interceptée :`, raw.detail);
      return [];
    }

    console.error(`[🚫 ${endpoint}] Axios error`, error.message || error);
    return [];
  }
}
