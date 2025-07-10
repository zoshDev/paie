import React, { useState } from 'react';
import GenericForm from '../../components/form/GenericForm';
import type { FormField, FormSection } from '../../components/form/GenericForm';
import { rubricFields } from './rubricField';
import { rubricTestData, completFormTest } from './RubricTestData';
import type { RubricFormData } from '../../components/form/fields/RubricMethodCalculator.types';

// Rubriques de test pour la base de calcul
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

const RubricForm: React.FC = () => {
  // État pour les données du formulaire et l'exemple sélectionné
  const [formData, setFormData] = useState<RubricFormData>(completFormTest);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>("completFormTest");

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

  // Sections du formulaire
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
        ["qui_paie", "taux_employe", "taux_employeur", "valeur_defaut"].includes(f.name)
      )
    },
    {
      title: "Méthode de calcul",
      fields: fieldsWithRubriques.filter(f => 
        ["methode_calcul", "bareme_progressif"].includes(f.name)
      )
    }
  ];

  // Change l'exemple actuel
  const handleExampleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const example = e.target.value;
    setSelectedExample(example);
    
    if (example === "completFormTest") {
      setFormData(completFormTest);
    } else if (rubricTestData[example]) {
      setFormData(rubricTestData[example]);
    }
  };

  const handleSubmit = (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    // Simuler une requête réseau
    console.log("Données soumises:", data);
    
    // Stockage des données et fin du chargement
    setTimeout(() => {
      setFormData(data as RubricFormData);
      setIsSubmitting(false);
      alert("Rubrique enregistrée avec succès!");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Formulaire de gestion des rubriques
      </h1>
      
      {/* Sélecteur d'exemples */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <label htmlFor="example-selector" className="font-medium text-indigo-700 whitespace-nowrap">
            Charger un exemple:
          </label>
          <select
            id="example-selector"
            className="border border-indigo-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={selectedExample}
            onChange={handleExampleChange}
          >
            <option value="completFormTest">Test complet</option>
            <optgroup label="Types de rubrique">
              <option value="salaireDeBase">Salaire de base</option>
              <option value="primeAnciennete">Gain (montant fixe)</option>
              <option value="primeRendement">Gain (pourcentage)</option>
              <option value="irpp">Déduction (barème)</option>
              <option value="cnps">Déduction (formule)</option>
            </optgroup>
            <optgroup label="Méthodes de calcul">
              <option value="primeAnciennete">Montant fixe</option>
              <option value="mutuelle">Pourcentage (base standard)</option>
              <option value="primeProjet">Pourcentage (rubriques)</option>
              <option value="irpp">Barème progressif</option>
              <option value="cnps">Formule personnalisée</option>
            </optgroup>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <GenericForm
          sections={formSections}
          initialValues={formData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Enregistrer la rubrique"
        />
      </div>

      {/* Section de débogage */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          Données actuelles du formulaire
        </h2>
        <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-96 text-sm">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default RubricForm; 