import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RubricsListPage from './RubricsListPage';
import RubricFormMain from './RubricFormMain';
import RubricForm from './RubricForm'; // Pour des tests uniquement

/**
 * Module de gestion des rubriques de paie
 * 
 * Ce composant gère les routes pour:
 * - La liste des rubriques
 * - La création d'une nouvelle rubrique
 * - La modification d'une rubrique existante
 * - La vue de démonstration
 */
const RubricModule: React.FC = () => {
  return (
    <Routes>
      {/* Page principale: Liste des rubriques */}
      <Route path="/" element={<RubricsListPage />} />
      
      {/* Création d'une nouvelle rubrique */}
      <Route path="/new" element={<RubricFormMain isEdit={false} />} />
      
      {/* Modification d'une rubrique existante */}
      <Route path="/edit/:id" element={<RubricFormMain isEdit={true} />} />
      
      {/* Page de démonstration (pour développement uniquement) */}
      <Route path="/demo" element={<RubricForm />} />
      
      {/* Redirection par défaut vers la liste */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RubricModule; 