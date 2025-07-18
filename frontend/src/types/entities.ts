import type { RawEmployee } from "../pages/employee/rawEmployee";
import type { Societe } from "../pages/company/types";
// etc.

export type Entity = {
  id: string;
} & Partial<RawEmployee>;
