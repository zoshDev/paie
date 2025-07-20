//import axios from '@/utils/axiosInstance';
import { safeGet, safePost, safeUpdate } from '@/utils/safeRequest';
import type { RawEmployee as Employee } from '@/pages/employee/rawEmployee';
import type { EmployeeFormData } from '@/schemas/employee/employee.zod';


export const employeService = {
  //create: (data: any) => axios.post('/employes', data),
  getRole: (id:number) => safeGet(`/role/${id}`),
  getRoles: () => safeGet('/role/get_all_role_element_salaire'),
  list: () => safeGet<Employee[]>('/employe'),
  create: (data:EmployeeFormData) => safePost<EmployeeFormData, Employee>('/employe',data),
  update: (id: string, data: any) => safeUpdate<EmployeeFormData, Employee>(`/employe/${id}`, data),
  // autres méthodes : getAll, update, delete...
};
