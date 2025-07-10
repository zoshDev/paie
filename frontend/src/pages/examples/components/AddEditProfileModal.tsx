import { useState, useEffect } from 'react';
import { useExamplePayrollProfileStore } from '../../../stores/examplePayrollProfileStore';
import type { PayrollProfile, PayrollItem } from '../../../models/payrollProfiles';
import {
  PlusIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface AddEditProfileModalProps {
  isOpen: boolean;
  isEdit: boolean;
  profile: PayrollProfile | null;
  categories: { id: string; name: string }[];
  onClose: () => void;
}

export default function AddEditProfileModal({
  isOpen,
  isEdit,
  profile,
  categories,
  onClose,
}: AddEditProfileModalProps) {
  const [formData, setFormData] = useState<Omit<PayrollProfile, 'id'>>({
    name: '',
    description: '',
    isDefault: false,
    categoryId: '',
    items: [],
  });
  
  const [activeTab, setActiveTab] = useState<'general' | 'items'>('general');
  const [newItem, setNewItem] = useState<Omit<PayrollItem, 'id'>>({
    name: '',
    code: '',
    amount: 0,
    type: 'earning',
    isDefault: false,
  });

  const { addProfile, updateProfile } = useExamplePayrollProfileStore();

  // Initialize form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        description: profile.description,
        isDefault: profile.isDefault,
        categoryId: profile.categoryId || '',
        items: [...profile.items],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isDefault: false,
        categoryId: '',
        items: [],
      });
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value,
    });
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number fields specifically
    if (name === 'amount' && type === 'number') {
      setNewItem({
        ...newItem,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setNewItem({
        ...newItem,
        [name]: type === 'checkbox' 
          ? (e.target as HTMLInputElement).checked 
          : value,
      });
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.code) return;
    
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { 
          ...newItem, 
          id: `temp-${Date.now()}` // Temporary ID will be replaced when saved
        }
      ]
    });
    
    // Reset new item form
    setNewItem({
      name: '',
      code: '',
      amount: 0,
      type: 'earning',
      isDefault: false,
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && profile) {
      updateProfile(profile.id, formData);
    } else {
      addProfile(formData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all dark:bg-gray-800">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {isEdit ? 'Modifier le profil de paie' : 'Ajouter un profil de paie'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                <button
                  type="button"
                  className={`
                    py-4 px-1 text-sm border-b-2 whitespace-nowrap
                    ${activeTab === 'general' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                  `}
                  onClick={() => setActiveTab('general')}
                >
                  Informations générales
                </button>
                <button
                  type="button"
                  className={`
                    py-4 px-1 text-sm border-b-2 whitespace-nowrap
                    ${activeTab === 'items' 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}
                  `}
                  onClick={() => setActiveTab('items')}
                >
                  Rubriques
                </button>
              </nav>
            </div>
            
            {/* Modal content */}
            <div className="p-6">
              {activeTab === 'general' ? (
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom du profil *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Catégorie
                    </label>
                    <select
                      name="categoryId"
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Default checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Profil standard (s'applique à tous les employés par défaut)
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Rubriques du profil de paie
                  </h4>
                  
                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Code
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Nom
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Type
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Montant
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Standard
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                        {formData.items.map((item, index) => (
                          <tr key={item.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">
                              {item.code}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {item.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {item.type === 'earning' ? 'Gain' : 'Déduction'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {item.amount}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {item.isDefault ? 'Oui' : 'Non'}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Add new item form */}
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <td className="whitespace-nowrap py-2 pl-4 pr-3">
                            <input
                              type="text"
                              name="code"
                              value={newItem.code}
                              onChange={handleNewItemChange}
                              placeholder="Code"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            <input
                              type="text"
                              name="name"
                              value={newItem.name}
                              onChange={handleNewItemChange}
                              placeholder="Nom"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            <select
                              name="type"
                              value={newItem.type}
                              onChange={handleNewItemChange}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            >
                              <option value="earning">Gain</option>
                              <option value="deduction">Déduction</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            <input
                              type="number"
                              name="amount"
                              value={newItem.amount}
                              onChange={handleNewItemChange}
                              placeholder="Montant"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={newItem.isDefault}
                              onChange={(e) => setNewItem({...newItem, isDefault: e.target.checked})}
                              className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="whitespace-nowrap py-2 pl-3 pr-4 text-right">
                            <button
                              type="button"
                              onClick={handleAddItem}
                              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              disabled={!newItem.name || !newItem.code}
                            >
                              <PlusIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {formData.items.length === 0 && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Aucune rubrique ajoutée. Utilisez le formulaire ci-dessus pour ajouter des rubriques.
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!formData.name}
              >
                {isEdit ? 'Enregistrer les modifications' : 'Ajouter le profil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 