import React, { useState } from "react";
import RubricForm from "../components/form/RubricForm";

const TestRubricForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<Record<string, any> | null>(null);

  // Données initiales pour le test
  const initialData = {
    code: "CNSS",
    nom: "Cotisation Nationale de Sécurité Sociale",
    type: "deduction",
    description: "Cotisation obligatoire pour la sécurité sociale",
    qui_paie: "les_deux",
    taux_employe: 5.25,
    taux_employeur: 8.5,
    ordre_application: 100
  };

  const handleSubmit = (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    // Simuler une opération asynchrone (comme un appel API)
    setTimeout(() => {
      console.log("Données soumises:", data);
      setLastSubmittedData(data);
      setIsSubmitting(false);
      alert("Rubrique enregistrée avec succès!");
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Test du formulaire de rubrique</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RubricForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
        
        <div>
          <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Dernières données soumises</h2>
            {lastSubmittedData ? (
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(lastSubmittedData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 text-sm">Aucune donnée soumise pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRubricForm; 