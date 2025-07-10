import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema, EmployeeFormData } from '../schemas/employee/employee.schema';

export function useEmployeeForm(onSubmit: (data: EmployeeFormData) => void) {
  return useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
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
    mode: 'onBlur',
  });
}
