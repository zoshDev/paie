import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import type { FormField } from '../../components/form/GenericForm';

export const societeFields: FormField[] = [
  { name: 'Nom', label: 'Nom de la société', type: 'text', required: true, /*icon: <BuildingOfficeIcon className="w-4 h-4" />*/ },
  { name: 'Adresse', label: 'Adresse', type: 'text' },
  { name: 'CodePostal', label: 'Code Postal', type: 'text' },
  { name: 'Ville', label: 'Ville', type: 'text' },
  { name: 'Pays', label: 'Pays', type: 'text' },
];