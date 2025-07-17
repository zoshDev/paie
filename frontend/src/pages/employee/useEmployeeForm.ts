import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeZodSchema } from '@/schemas/employee/employee.zod';
import type { EmployeeFormData } from '@/schemas/employee/employee.zod';

export const useEmployeeForm = (onSubmit: (data: EmployeeFormData) => void) => {
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeZodSchema),
    defaultValues: {
      matricule: '',
      statutFamilial: '',
      nbEnfants: 0,
      nationalite: '',
      estLoge: false,
      societeId: 0,
      categorieEchelonId: 0,
      pseudo: '',
      password: '',
      roleId: [],
    },
  });

  return {
    ...form,
    handleSubmit: form.handleSubmit(onSubmit),
  };
};
