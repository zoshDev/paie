import axios from 'axios';
import type { ProfilPaie } from './ProfilPaie';

export const profilPaieService = {
  list: () => axios.get('role/get_all_role_element_salaire'),
  create: (data: ProfilPaie) => axios.post('/role', data),
  update: (id: number, data: ProfilPaie) => axios.put(`/profils-paie/${id}`, data),
  remove: (id: number) => axios.delete(`/profils-paie/${id}`),
};
