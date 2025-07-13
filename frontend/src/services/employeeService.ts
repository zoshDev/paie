//import axios from '@/utils/axiosInstance';
import { safePost, safeUpdate } from '@/utils/safeRequest';
import type { Employee } from '@/pages/employee/types';
import type { EmployeeFormData } from '@/schemas/employee/employee.zod';


export const employeService = {
  //create: (data: any) => axios.post('/employes', data),
  create: (data:EmployeeFormData) => safePost<EmployeeFormData, Employee>('/employes',data),
  update: (id: string, data: any) => safeUpdate<EmployeeFormData, Employee>(`/employes/${id}`, data),
  // autres méthodes : getAll, update, delete...
};
