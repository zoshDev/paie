import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { rubricTestData } from './RubricTestData';
import type { RubricFormData } from '../../components/form/fields/RubricMethodCalculator.types';

// Type de données pour l'affichage des rubriques avec métadonnées supplémentaires
interface RubricDisplayData extends RubricFormData {
  id: string; // ID unique pour l'affichage
}

const RubricsListPage: React.FC = () => {
  // États pour gérer les données et le filtrage
  const [rubriques, setRubriques] = useState<RubricDisplayData[]>([]);
  const [filteredRubriques, setFilteredRubriques] = useState<RubricDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // Charger les données des rubriques (simulation)
  useEffect(() => {
    const loadRubrics = async () => {
      try {
        setIsLoading(true);
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Transformer les données de test en tableau avec des IDs
        const rubricList = Object.entries(rubricTestData).map(([key, rubric]) => ({
          ...rubric,
          id: key,
        }));
        
        setRubriques(rubricList);
        setFilteredRubriques(rubricList);
      } catch (error) {
        console.error('Erreur lors du chargement des rubriques:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRubrics();
  }, []);
  
  // Filtrer les rubriques en fonction du terme de recherche et du type sélectionné
  useEffect(() => {
    let result = rubriques;
    
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        r => r.code.toLowerCase().includes(term) || 
             r.nom.toLowerCase().includes(term)
      );
    }
    
    // Filtre par type
    if (selectedType) {
      result = result.filter(r => r.type === selectedType);
    }
    
    setFilteredRubriques(result);
  }, [rubriques, searchTerm, selectedType]);
  
  // Gérer la suppression d'une rubrique
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la rubrique "${name}" ?`)) {
      // Simuler la suppression
      const updatedRubriques = rubriques.filter(r => r.id !== id);
      setRubriques(updatedRubriques);
    }
  };
  
  // Fonction pour obtenir le badge de type de rubrique
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'salaire':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Salaire de base</span>;
      case 'gain':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Gain</span>;
      case 'deduction':
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Déduction</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Autre</span>;
    }
  };
  
  // Fonction pour obtenir un texte descriptif de la méthode de calcul
  const getMethodeCalculDescription = (rubrique: RubricFormData) => {
    switch (rubrique.methode_calcul) {
      case 'montant_fixe':
        return `Montant fixe : ${rubrique.montant_fixe?.toLocaleString() || 0} FCFA`;
      case 'pourcentage':
        return `Pourcentage : ${rubrique.pourcentage || 0}%`;
      case 'bareme_progressif':
        return 'Barème progressif';
      case 'formule_personnalisee':
        return 'Formule personnalisée';
      default:
        return 'Non définie';
    }
  };
  
  // Si chargement en cours, afficher un indicateur
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Liste des rubriques de paie</h1>
        <Link 
          to="/rubriques/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Nouvelle rubrique
        </Link>
      </div>
      
      {/* Filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par code ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {/* Filtre par type */}
          <div className="md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Tous les types</option>
              <option value="salaire">Salaire de base</option>
              <option value="gain">Gain</option>
              <option value="deduction">Déduction</option>
            </select>
          </div>
          
          {/* Bouton réinitialiser */}
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Réinitialiser
          </button>
        </div>
      </div>
      
      {/* Tableau des rubriques */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRubriques.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode de calcul
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ordre
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRubriques.map((rubrique) => (
                  <tr key={rubrique.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rubrique.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rubrique.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(rubrique.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getMethodeCalculDescription(rubrique)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rubrique.ordre_application}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/rubriques/edit/${rubrique.code}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(rubrique.id, rubrique.nom)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Aucune rubrique trouvée
          <div className="py-12 text-center">
            {rubriques.length === 0 ? (
              <div>
                <p className="text-gray-600 mb-4">Aucune rubrique n'a été créée</p>
                <Link 
                  to="/rubriques/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  Ajouter votre première rubrique
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">Aucune rubrique ne correspond à votre recherche</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                  }}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <ArrowPathIcon className="h-4 w-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Statistiques */}
      {filteredRubriques.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Salaire de base</h3>
            <p className="text-xl font-semibold mt-1">
              {rubriques.filter(r => r.type === 'salaire').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Gains</h3>
            <p className="text-xl font-semibold mt-1">
              {rubriques.filter(r => r.type === 'gain').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Déductions</h3>
            <p className="text-xl font-semibold mt-1">
              {rubriques.filter(r => r.type === 'deduction').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RubricsListPage; 