import { safeGet, safePost, safeDelete,safeUpdate } from '@/utils/safeRequest';
import type { CategorieEchelon } from '@/types/categorieEchelon';

export const categorieEchelonService = {
  list: () => safeGet<CategorieEchelon>('/categorie_echelon/get_all_categorie_echelon'),
  create: (data: Omit<CategorieEchelon, 'id'>) =>
    safePost<Omit<CategorieEchelon, 'id'>, CategorieEchelon>('/categorie_echelon', data),
  delete: (id: number) => safeDelete(`/categorie-echelon/${id}`),
  update: (data: CategorieEchelon) => safeUpdate(`/categorie_echelon/${data.id}`, data),
};
