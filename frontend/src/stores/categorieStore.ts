import { create } from 'zustand';

export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  profils?: { id: number; nom: string }[];
  nbEmployes?: number;
}

interface CategorieStore {
  categories: Categorie[];
  loading: boolean;
  addCategory: (cat: Omit<Categorie, 'id'>) => void;
  editCategory: (id: number, data: Partial<Categorie>) => void;
  deleteCategory: (id: number) => void;
}

export const useCategoriesStore = create<CategorieStore>((set) => ({
  categories: [
    // Exemple de données initiales
    { id: 1, nom: 'Cadre', description: 'Cadres', profils: [], nbEmployes: 3 },
    { id: 2, nom: 'Employé', description: 'Employés', profils: [], nbEmployes: 10 },
  ],
  loading: false,

  addCategory: (cat) =>
    set((state) => ({
      categories: [
        ...state.categories,
        { ...cat, id: Date.now() }, // id unique simple
      ],
    })),

  editCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...data } : cat
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
    })),
}));