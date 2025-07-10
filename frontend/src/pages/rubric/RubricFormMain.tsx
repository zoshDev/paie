import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GenericForm from '../../components/form/GenericForm';
import type { FormField, FormSection } from '../../components/form/GenericForm';
import { rubricFields } from './rubricField';
import { rubricTestData, completFormTest } from './RubricTestData';
import type { RubricFormData, MethodeCalcul } from '../../components/form/fields/RubricMethodCalculator.types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Rubriques disponibles pour la base de calcul
// Dans une application réelle, ces données viendraient d'une API
const rubriquesDispo = [
  { value: "rubrique_001", label: "Salaire de base" },
  { value: "rubrique_002", label: "Prime d'ancienneté" },
  { value: "rubrique_003", label: "Indemnité de transport" },
  { value: "rubrique_004", label: "Prime de rendement" },
  { value: "rubrique_005", label: "Heures supplémentaires" },
  { value: "rubrique_006", label: "CNPS" },
  { value: "rubrique_007", label: "Assurance maladie" },
  { value: "rubrique_008", label: "IRPP" }
];

interface RubricFormMainProps {
  isEdit?: boolean;
  onCancel?: () => void;
}

const RubricFormMain: React.FC<RubricFormMainProps> = ({ isEdit = false, onCancel }) => {
  // Récupérer l'id de la rubrique si on est en mode édition
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  // États pour gérer le chargement et les données
  const [isLoading, setIsLoading] = useState(isEdit);
  const [formData, setFormData] = useState<RubricFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effet pour charger les données de la rubrique si on est en mode édition
  useEffect(() => {
    const loadRubricData = async () => {
      if (isEdit && id) {
        try {
          setIsLoading(true);
          // Ici, simulons une récupération depuis une API
          // Dans une vraie application, ce serait un appel API
          setTimeout(() => {
            // Utiliser les données de test pour simuler
            const rubricData = Object.values(rubricTestData).find(
              (r) => r.code === id
            );
            
            if (rubricData) {
              setFormData(rubricData);
            } else {
              setError("Rubrique introuvable");
            }
            setIsLoading(false);
          }, 500);
        } catch (err) {
          setError("Erreur lors du chargement des données");
          setIsLoading(false);
        }
      } else {
        // Mode création, utiliser des valeurs par défaut
        setFormData({
          code: "",
          nom: "",
          type: "gain",
          description: "",
          qui_paie: "employeur",
          methode_calcul: "montant_fixe" as MethodeCalcul,
          ordre_application: 200,
          valeur_defaut: 0
        });
      }
    };

    loadRubricData();
  }, [isEdit, id]);

  // Mise à jour des champs pour inclure les rubriques disponibles
  const fieldsWithRubriques: FormField[] = rubricFields.map(field => {
    if (field.type === 'select' && field.name === 'methode_calcul') {
      return {
        ...field,
        type: 'rubric_method_calculator' as const,
        rubriquesDisponibles: rubriquesDispo
      };
    }
    return field as unknown as FormField;
  });

  // Organiser les champs en sections
  const formSections: FormSection[] = [
    {
      title: "Informations générales",
      fields: fieldsWithRubriques.filter(f => 
        ["code", "nom", "type", "description", "ordre_application"].includes(f.name)
      )
    },
    {
      title: "Configuration du paiement",
      fields: fieldsWithRubriques.filter(f => 
        ["qui_paie", "taux_employe", "taux_employeur"].includes(f.name)
      )
    },
    {
      title: "Méthode de calcul",
      fields: fieldsWithRubriques.filter(f => 
        ["methode_calcul", "bareme_progressif"].includes(f.name)
      )
    },
    {
      title: "Autres paramètres",
      fields: fieldsWithRubriques.filter(f => 
        ["valeur_defaut"].includes(f.name)
      )
    }
  ];

  // Gérer la soumission du formulaire
  const handleSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    // Log des données soumises
    console.log("Données du formulaire à soumettre:", data);
    
    try {
      // Simuler un appel API pour enregistrer les données
      // Dans une vraie application, on ferait un appel API ici
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mise à jour des données locales
      setFormData(data as RubricFormData);
      
      // Notification de succès
      toast.success(`La rubrique a été ${isEdit ? 'modifiée' : 'créée'} avec succès !`);
      
      // Redirection vers la liste des rubriques ou autre page
      if (onCancel) {
        onCancel();
      } else {
        navigate('/rubriques');  // Adapter selon votre structure de routes
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement de la rubrique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer l'annulation du formulaire
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/rubriques');  // Adapter selon votre structure de routes
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={handleCancel}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* En-tête avec bouton retour */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100"
            title="Retour"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
          </h1>
        </div>
        
        {isEdit && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            Code: {formData.code}
          </div>
        )}
      </div>
      
      {/* Mode démonstration - Uniquement pour fins de débogage */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <div className="font-medium text-yellow-800 mb-2">Mode démonstration</div>
          <p className="text-yellow-700">
            Ce formulaire est en mode démonstration. Les données ne sont pas réellement enregistrées.
          </p>
        </div>
      )}
      
      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <GenericForm
          sections={formSections}
          initialValues={formData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel={isEdit ? "Mettre à jour" : "Créer la rubrique"}
        />
      </div>

      {/* Section de débogage - À retirer en production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Données actuelles du formulaire
          </h2>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-96 text-sm">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RubricFormMain; 