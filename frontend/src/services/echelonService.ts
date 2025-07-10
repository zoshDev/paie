import { safeGet, safePost, safeUpdate, safeDelete } from '@/utils/safeRequest';
import type { Echelon, EchelonCreateDto } from '@/types/echelon.ts';

export const echelonService = {
  list: () => safeGet<Echelon>('/echelon'),
  create: (data: EchelonCreateDto) => safePost<EchelonCreateDto, Echelon>('/echelon', data),
  update: (data: Echelon) => safeUpdate<Echelon, Echelon>('/echelon', data),
  delete: (id: number) => safeDelete(`/echelon/${id}`),
};
