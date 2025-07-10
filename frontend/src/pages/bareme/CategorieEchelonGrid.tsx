import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Menu, { MenuItem } from '@/components/ui/Menu/Menu';
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

import useCategories from '@/hooks/useCategories';
import useEchelons from '@/hooks/useEchelons';
import useCategorieEchelons from '@/hooks/useCategorieEchelons';

const CategorieEchelonGrid: React.FC = () => {
  const { categories } = useCategories();
  const { echelons } = useEchelons();
  const { associations, isLoading, isError, searchTerm, setSearchTerm } = useCategorieEchelons();

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const toggleActions = () => setIsActionsOpen((prev) => !prev);

  const getLibelle = (id: string, list: { id: string; libelle: string }[]) =>
    list.find((item) => item.id === id)?.libelle ?? '[Introuvable]';

  const handleAddAssociation = () => {
    alert('Ajouter une nouvelle association');
    setIsActionsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) return <div className="p-6">Chargement des associations...</div>;
  if (isError) return <div className="p-6 text-red-600">Erreur lors du chargement</div>;

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Associations Catégorie ↔ Échelon" description="Définir les combinaisons disponibles pour les employés">
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Rechercher une association..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:flex-1"
          />
          <div className="relative">
            <Button onClick={toggleActions} className="flex items-center whitespace-nowrap">
              <span>Actions</span>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Button>
            <Menu isOpen={isActionsOpen} onClose={() => setIsActionsOpen(false)}>
              <MenuItem onClick={handleAddAssociation} icon={<PlusIcon className="w-5 h-5" />}>
                Ajouter une Association
              </MenuItem>
            </Menu>
          </div>
        </div>
      </PageHeader>

      {associations.length === 0 ? (
        <p className="text-gray-500 mt-6">Aucune association définie</p>
      ) : (
        <table className="w-full table-auto border-collapse mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2 border">Catégorie</th>
              <th className="text-left p-2 border">Échelon</th>
            </tr>
          </thead>
          <tbody>
            {associations.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-2 border">{getLibelle(entry.categorieId, categories)}</td>
                <td className="p-2 border">{getLibelle(entry.echelonId, echelons)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategorieEchelonGrid;
