import {api} from '@/services/api/config';
import { toast } from 'react-hot-toast';
import type { AxiosResponse } from 'axios';

// Vérifie si la réponse d'erreur est une validation Pydantic
function handlePydanticError(endpoint: string, error: any): boolean {
  const raw = error?.response?.data;
  const isPydanticError =
    typeof raw === 'object' &&
    raw !== null &&
    'detail' in raw &&
    Array.isArray(raw.detail);

  if (isPydanticError) {
    toast.error(`[${endpoint}] ${raw.detail[0]?.msg ?? 'Erreur de validation'}`);
    console.warn(`[🛑 ${endpoint}] Erreur Pydantic interceptée :`, raw.detail);
    return true;
  }

  return false;
}

export async function safeGet<T>(endpoint: string): Promise<T[] | []> {
  try {
    const response: AxiosResponse = await api.get(endpoint);
    toast.success(`[GET ${endpoint}] Données chargées ✅`);
    const raw = response.data;
    return Array.isArray(raw) ? raw : [];
  } catch (error: any) {
    if (handlePydanticError(endpoint, error)) return [];
    toast.error(`[GET ${endpoint}] Échec du chargement ❌`);
    console.error(`[🚫 ${endpoint}] Erreur Axios`, error.message || error);
    return [];
  }
}


export async function safePost<TRequest, TResponse>(
  endpoint: string,
  data: TRequest
): Promise<TResponse | null> {
  try {
    const response: AxiosResponse = await api.post(endpoint, data);
    toast.success(`[POST ${endpoint}] Création réussie ✅`);
    return response.data;
  } catch (error: any) {
    if (handlePydanticError(endpoint, error)) return null;
    toast.error(`[POST ${endpoint}] Échec de la création ❌`);
    console.error(`[🚫 ${endpoint}] Erreur POST`, error.message || error);
    return null;
  }
}

export async function safeUpdate<TRequest, TResponse>(
  endpoint: string,
  data: TRequest
): Promise<TResponse | null> {
  try {
    const response: AxiosResponse = await api.patch(endpoint, data);
    toast.success(`[PATCH ${endpoint}] Mise à jour réussie ✅`);
    return response.data;
  } catch (error: any) {
    if (handlePydanticError(endpoint, error)) return null;
    toast.error(`[PATCH ${endpoint}] Échec de la mise à jour ❌`);
    console.error(`[🚫 ${endpoint}] Erreur PATCH`, error.message || error);
    return null;
  }
}

export async function safeDelete(endpoint: string): Promise<boolean> {
  try {
    await api.delete(endpoint);
    toast.success(`[DELETE ${endpoint}] Suppression réussie ✅`);
    return true;
  } catch (error: any) {
    toast.error(`[DELETE ${endpoint}] Échec de la suppression ❌`);
    console.error(`[🚫 ${endpoint}] Erreur DELETE`, error.message || error);
    return false;
  }
}

