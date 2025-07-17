import { safePost, safeGet } from '@/utils/safeRequest';
import type { BulletinPaie } from './bulletin';
import type { BulletinFormData } from './bulletin.zod';

export const bulletinService = {
  create: (data: BulletinFormData) =>
    safePost<BulletinFormData, BulletinPaie>('/bulletins', data),

  getByEmployeId: (id: string | number) =>
    safeGet<BulletinPaie[]>(`/bulletins/by-employe/${id}`),

  evaluate: (id: string | number) =>
    safeGet<BulletinPaie>(`/bulletins/evaluate/${id}`),
};
