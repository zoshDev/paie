import { safeGet, safePost, safeUpdate, safeDelete } from '@/utils/safeRequest';
import type { Categorie, CategorieCreateDto } from '@/types/categorie';

export const categorieService = {
  list: () => safeGet<Categorie>('/categorie'),
  create: (data: CategorieCreateDto) => safePost<CategorieCreateDto, Categorie>('/categorie', data),
  update: (data: Categorie) => safeUpdate<Categorie, Categorie>('/categorie', data),
  delete: (id: number) => safeDelete(`/categorie/${id}`),
};
