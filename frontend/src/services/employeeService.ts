import axios from '@/utils/axiosInstance';

export const employeService = {
  create: (data: any) => axios.post('/employes', data),
  update: (id: string, data: any) => axios.put(`/employes/${id}`, data),
  // autres méthodes : getAll, update, delete...
};
