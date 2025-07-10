// PayrollItem interfaces and types
export interface PayrollItem {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: 'earning' | 'deduction';
  payer: 'employee' | 'employer' | 'both';
  calculationMethod: 'fixed' | 'percentage' | 'progressive' | 'formula';
  amount: number;
  percentage?: number;
  baseItemIds?: string[];
  formula?: string;
  referenceValue?: string;
  employeeRate?: number;
  employerRate?: number;
  progressiveRates?: ProgressiveRate[];
  isActive: boolean;
  isDefault: boolean;
  order?: number;
  categoryId?: string;
}

export interface ProgressiveRate {
  id: string;
  minAmount: number;
  maxAmount?: number; // undefined means no upper limit
  rate: number;
  additionalAmount?: number;
}

export interface PayrollItemFilter {
  searchQuery: string;
  type: 'all' | 'earning' | 'deduction';
  payer: 'all' | 'employee' | 'employer' | 'both';
  isActive: 'all' | boolean;
} 