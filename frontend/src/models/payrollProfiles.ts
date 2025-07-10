// PayrollProfile interfaces and types
export interface PayrollItem {
  id: string;
  name: string;
  code: string;
  amount: number;
  type: 'earning' | 'deduction';
  isDefault: boolean;
  categoryId?: string;
}

export interface PayrollProfile {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  categoryId?: string;
  items: PayrollItem[];
}

export interface EmployeePayrollProfile {
  employeeId: string;
  profileId: string;
  customizations?: {
    itemId: string;
    amount?: number;
    disabled?: boolean;
  }[];
} 