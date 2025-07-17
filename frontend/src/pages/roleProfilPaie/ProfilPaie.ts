import type { ElementSalaire } from "../elementSalaire/elementSalaire";

export interface ProfilPaie {
  id: string;
  nom: string;
  elements: ElementSalaire[];
}
