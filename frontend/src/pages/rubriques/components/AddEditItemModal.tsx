import { useState, useEffect } from 'react';
import { usePayrollItemStore } from '../../../stores/payrollItemStore';
import type { PayrollItem } from '../../../models/payrollItems';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddEditItemModalProps {
  isOpen: boolean;
  isEdit: boolean;
  item: PayrollItem | null;
  items: PayrollItem[];
  onClose: () => void;
}

export default function AddEditItemModal({
  isOpen,
  isEdit,
  item,
  items,
  onClose,
}: AddEditItemModalProps) {
  // État initial
  const emptyFormData: Omit<PayrollItem, 'id'> = {
    name: '',
    description: '',
    code: '',
    type: 'earning',
    payer: 'employer',
    calculationMethod: 'fixed',
    amount: 0,
    isActive: true,
    isDefault: false,
    order: items.length + 1,
  };
  
  const [formData, setFormData] = useState<Omit<PayrollItem, 'id'>>(emptyFormData);
  const [selectedBaseItems, setSelectedBaseItems] = useState<string[]>([]);
  
  const { addItem, updateItem } = usePayrollItemStore();

  // Initialisation avec les données de l'élément existant
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        code: item.code,
        type: item.type,
        payer: item.payer,
        calculationMethod: item.calculationMethod,
        amount: item.amount,
        percentage: item.percentage,
        baseItemIds: item.baseItemIds,
        formula: item.formula,
        progressiveRates: item.progressiveRates,
        employeeRate: item.employeeRate,
        employerRate: item.employerRate,
        isActive: item.isActive,
        isDefault: item.isDefault,
        order: item.order || items.length + 1,
        categoryId: item.categoryId
      });
      
      if (item.baseItemIds) {
        setSelectedBaseItems(item.baseItemIds);
      }
    } else {
      setFormData(emptyFormData);
      setSelectedBaseItems([]);
    }
  }, [item, items.length]);

  // Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Empêche le scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ 
        ...formData, 
        [name]: (e.target as HTMLInputElement).checked 
      });
      return;
    }
    
    if (type === 'number') {
      setFormData({ 
        ...formData, 
        [name]: parseFloat(value) || 0 
      });
      return;
    }
    
    if (name === 'calculationMethod') {
      const newFormData = { ...formData } as Omit<PayrollItem, 'id'>;
      
      switch (value as PayrollItem['calculationMethod']) {
        case 'fixed':
          newFormData.calculationMethod = 'fixed';
          newFormData.percentage = undefined;
          newFormData.baseItemIds = undefined;
          newFormData.formula = undefined;
          newFormData.progressiveRates = undefined;
          setSelectedBaseItems([]);
          break;
        case 'percentage':
          newFormData.calculationMethod = 'percentage';
          newFormData.amount = 0;
          newFormData.formula = undefined;
          newFormData.progressiveRates = undefined;
          break;
        case 'progressive':
          newFormData.calculationMethod = 'progressive';
          newFormData.amount = 0;
          newFormData.percentage = undefined;
          newFormData.baseItemIds = undefined;
          newFormData.formula = undefined;
          newFormData.progressiveRates = [];
          setSelectedBaseItems([]);
          break;
        case 'formula':
          newFormData.calculationMethod = 'formula';
          newFormData.amount = 0;
          newFormData.percentage = undefined;
          newFormData.baseItemIds = undefined;
          newFormData.progressiveRates = undefined;
          setSelectedBaseItems([]);
          break;
      }
      
      setFormData(newFormData);
      return;
    }
    
    if (name === 'payer') {
      const newValue = value as PayrollItem['payer'];
      const newFormData = { 
        ...formData, 
        payer: newValue 
      };
      
      if (newValue !== 'both') {
        newFormData.employeeRate = undefined;
        newFormData.employerRate = undefined;
      }
      
      setFormData(newFormData);
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const handleBaseItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedBaseItems(selectedOptions);
    setFormData({ ...formData, baseItemIds: selectedOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    try {
      if (isEdit && item) {
        await updateItem(item.id, formData);
      } else {
        await addItem(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* En-tête */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {isEdit ? 'Modifier la rubrique de paie' : 'Ajouter une rubrique de paie'}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none p-1 rounded"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Contenu du formulaire */}
          <div className="p-6 space-y-6">
            {/* Informations de base */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Informations générales
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    id="code"
                    required
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={2}
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="earning">Gain</option>
                    <option value="deduction">Déduction</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="payer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payeur <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payer"
                    id="payer"
                    required
                    value={formData.payer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="employer">Employeur</option>
                    <option value="employee">Employé</option>
                    <option value="both">Les deux</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Méthode de calcul */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Méthode de calcul
              </h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="calculationMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Méthode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="calculationMethod"
                    id="calculationMethod"
                    required
                    value={formData.calculationMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="fixed">Montant fixe</option>
                    <option value="percentage">Pourcentage</option>
                    <option value="progressive">Barème progressif</option>
                    <option value="formula">Formule personnalisée</option>
                  </select>
                </div>
                
                {/* Champs conditionnels selon la méthode */}
                {formData.calculationMethod === 'fixed' && (
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Montant <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      required
                      value={formData.amount || 0}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}
                
                {formData.calculationMethod === 'percentage' && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Pourcentage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="percentage"
                        id="percentage"
                        required
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.percentage || 0}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="baseItemIds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Appliqué sur <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="baseItemIds"
                        id="baseItemIds"
                        multiple
                        size={3}
                        value={selectedBaseItems}
                        onChange={handleBaseItemChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        {items.filter(i => i.id !== item?.id).map(i => (
                          <option key={i.id} value={i.id}>
                            {i.code} - {i.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                        Maintenez Ctrl/Cmd pour sélectionner plusieurs rubriques
                      </p>
                    </div>
                  </div>
                )}
                
                {formData.calculationMethod === 'formula' && (
                  <div>
                    <label htmlFor="formula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Formule <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="formula"
                      id="formula"
                      rows={3}
                      required
                      value={formData.formula || ''}
                      onChange={handleInputChange}
                      placeholder="Ex: BASE_SALARY * 0.05 + ALLOWANCE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Options */}
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
                Options
              </h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Actif
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="isDefault"
                    name="isDefault"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Rubrique standard (ne peut pas être supprimée)
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pied de formulaire */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3 sticky bottom-0 bg-white dark:bg-gray-800">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEdit ? 'Enregistrer les modifications' : 'Ajouter la rubrique'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}