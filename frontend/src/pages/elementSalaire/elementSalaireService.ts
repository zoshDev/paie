import axios from 'axios';
import type { ElementSalaire } from './elementSalaire';
import { safeGet } from '@/utils/safeGet';

const BASE_URL = '/elements-salaire';

export const elementSalaireService = {
  // 📥 Lire tous les éléments
  getAll: () => safeGet<ElementSalaire>("/element_salaire/get_all_element_salaire") ,//async (): Promise<ElementSalaire[]> => {

  // ➕ Créer un nouvel élément
  create: async (data: ElementSalaire): Promise<void> => {
    await axios.post(BASE_URL, data);
  },

  // ✏️ Mettre à jour un élément existant
  update: async (id: number, data: ElementSalaire): Promise<void> => {
    await axios.put(`${BASE_URL}/${id}`, data);
  },

  // ❌ Supprimer un élément
  remove: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // 🧾 Obtenir un seul élément
  getById: async (id: number): Promise<ElementSalaire> => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },
};
