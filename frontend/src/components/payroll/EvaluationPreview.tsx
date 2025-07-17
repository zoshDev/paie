import React from 'react';
import type { Employee } from '@/pages/employee/types';

const EvaluationPreview = ({ employee }: { employee: Employee }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Évaluation de paie</h3>
      <p>ID employé : {employee.id}</p>
      {/* À venir : montants calculés */}
    </div>
  );
};

export default EvaluationPreview;
