import axios from 'axios';
import type { ProfilPaie } from './ProfilPaie';

export const profilPaieService = {
  list: () => axios.get('/profils-paie'),
  create: (data: ProfilPaie) => axios.post('/profils-paie', data),
  update: (id: number, data: ProfilPaie) => axios.put(`/profils-paie/${id}`, data),
  remove: (id: number) => axios.delete(`/profils-paie/${id}`),
};
