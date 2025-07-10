import type {ReactNode} from  'react';

export const TITLES: Record<string, string> = {
    '/': 'Tableau de bord',
    '/employees': 'Employés',
    '/employees/list': 'Employés',
    '/employees/add': 'Ajouter un employé',
    '/rubrics': 'Rubriques',
    '/societes': 'Société',
    '/rubrics/list': 'Liste des rubriques',
    '/rubrics/add': 'Ajouter une rubrique',
    '/categories': 'Catégories',
    '/profil-paie': 'Profil de paie',

    '/settings': 'Paramètres',
}

export interface MenuItem {
  title: string;
  icon: ReactNode;
  path: string;
  submenu?: { title: string; path: string }[];
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface HeaderProps {
  toggleSidebar: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

