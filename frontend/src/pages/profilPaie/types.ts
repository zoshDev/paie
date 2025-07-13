export interface ElementSalaire {
  id: string;
  libelle: string;            // ↔ ElementSalaire.libelle
  code: string;               // ↔ ElementSalaire.code
  type_element: string;       // ↔ ElementSalaire.type_element
  nature: string;             // ↔ ElementSalaire.nature
  imposable?: boolean;
  ordre?: number;             // facultatif (interne à l'association ?)
}

export interface RoleProfilPaie {
  id: string;                 // ↔ Role.id
  roleName: string;           // ↔ Role.roleName
  description?: string;
  categorie?: string;         // champ métier custom
  elements: ElementSalaire[]; // ↔ RoleElementSalaire[]
}
