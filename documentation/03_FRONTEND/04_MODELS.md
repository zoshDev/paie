# Types et Interfaces Frontend

Ce document détaille les types et interfaces TypeScript utilisés dans l'application frontend.

## 1. Types de Base

```typescript
// src/types/common.ts

export type ID = number;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

export type SortDirection = 'asc' | 'desc';

export interface SortParams {
  field: string;
  direction: SortDirection;
}

export interface FilterParams {
  [key: string]: string | number | boolean | null;
}
```

## 2. Modèles d'Authentification

```typescript
// src/types/auth.ts

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export type UserRole = 'admin' | 'manager' | 'user';
```

## 3. Modèles d'Employé

```typescript
// src/types/employee.ts

export interface Employee {
  id: ID;
  matricule: string;
  nom: string;
  prenom: string;
  date_embauche: string;
  poste: string;
  categorie_id: number;
  categorie?: Categorie;
  echelon?: number;
  departement?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export type EmployeeStatus = 'active' | 'inactive' | 'en_conge';

export type EmployeeCreate = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

export type EmployeeUpdate = Partial<EmployeeCreate>;

export interface EmployeeFilters extends FilterParams {
  search?: string;
  categorie_id?: number;
  status?: EmployeeStatus;
  date_embauche_start?: string;
  date_embauche_end?: string;
}
```

## 4. Modèles de Rubrique

```typescript
// src/types/rubrique.ts

export interface Rubrique {
  id: ID;
  code: string;
  nom: string;
  description?: string;
  type: RubriqueType;
  methode_calcul: MethodeCalcul;
  ordre_application: number;
  qui_paie: QuiPaie;
  taux_employe?: number;
  taux_employeur?: number;
  valeur_defaut?: number;
  formule?: string;
  conditions?: RubriqueCondition[];
  created_at: string;
  updated_at: string;
}

export type RubriqueType = 'salaire' | 'gain' | 'deduction';

export type MethodeCalcul = 'montant_fixe' | 'pourcentage' | 'formule';

export type QuiPaie = 'employe' | 'employeur' | 'les_deux';

export interface RubriqueCondition {
  champ: string;
  operateur: string;
  valeur: string | number;
}

export interface MethodeCalculConfig {
  type: MethodeCalcul;
  baseAmount?: number;
  percentage?: number;
  formula?: string;
  dependencies?: string[];
}

export type RubriqueCreate = Omit<Rubrique, 'id' | 'created_at' | 'updated_at'>;

export type RubriqueUpdate = Partial<RubriqueCreate>;
```

## 5. Modèles de Catégorie

```typescript
// src/types/categorie.ts

export interface Categorie {
  id: ID;
  code: string;
  nom: string;
  description?: string;
  echelons: Echelon[];
  created_at: string;
  updated_at: string;
}

export interface Echelon {
  id: ID;
  niveau: number;
  salaire_base: number;
  categorie_id: number;
  created_at: string;
  updated_at: string;
}

export type CategorieCreate = Omit<Categorie, 'id' | 'created_at' | 'updated_at' | 'echelons'>;

export type EchelonCreate = Omit<Echelon, 'id' | 'created_at' | 'updated_at'>;
```

## 6. Modèles de Fiche de Paie

```typescript
// src/types/fichePaie.ts

export interface FichePaie {
  id: ID;
  employee_id: number;
  employee: Employee;
  periode: string;
  date_generation: string;
  salaire_brut: number;
  total_retenues: number;
  salaire_net: number;
  lignes_paie: LignePaie[];
  status: FichePaieStatus;
  created_at: string;
  updated_at: string;
}

export interface LignePaie {
  id: ID;
  fiche_paie_id: number;
  rubrique_id: number;
  rubrique: Rubrique;
  base: number;
  taux: number;
  montant: number;
  created_at: string;
  updated_at: string;
}

export type FichePaieStatus = 'brouillon' | 'validee' | 'payee';

export interface FichePaieCreate {
  employee_id: number;
  periode: string;
  rubriques?: number[]; // IDs des rubriques à inclure
}
```

## 7. Modèles de Configuration

```typescript
// src/types/settings.ts

export interface AppSettings {
  company: CompanySettings;
  payroll: PayrollSettings;
  email: EmailSettings;
  templates: TemplateSettings;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  tax_id?: string;
}

export interface PayrollSettings {
  default_currency: string;
  decimal_precision: number;
  pay_period: 'monthly' | 'bi-weekly';
  working_days_per_week: number;
  working_hours_per_day: number;
}

export interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  from_email: string;
  from_name: string;
}

export interface TemplateSettings {
  payslip_template: string;
  contract_template: string;
  email_templates: {
    payslip_notification: string;
    welcome_message: string;
  };
}
```

## 8. Types Utilitaires

```typescript
// src/types/utils.ts

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
}

export type FormMode = 'create' | 'edit' | 'view' | 'delete';

export interface SelectOption {
  label: string;
  value: string | number;
}
```
