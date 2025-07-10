import type { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  header: string;
  isSelection?: boolean;
  renderCell?: (item: T) => ReactNode;
}
