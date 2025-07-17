import { useState } from 'react';
import { bulletinService } from '@/components/payroll/bulletinService';
import type { Employee } from '@/pages/employee/types';

const BulletinForm = ({ employee }: { employee: Employee }) => {
  const [mois, setMois] = useState<number>(7);
  const [annee, setAnnee] = useState<number>(2025);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await bulletinService.create({
        employeId: Number(employee.id),
        mois,
        annee,
        elementSalaire: [], // 🛠️ à remplir dynamiquement si besoin
      });
      setMessage('✅ Bulletin généré avec succès !');
    } catch {
      setMessage('❌ Échec lors de la génération');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Générer un Bulletin de Paie</h3>

      <div className="flex space-x-4">
        <input
          type="number"
          value={mois}
          onChange={(e) => setMois(Number(e.target.value))}
          className="input"
          placeholder="Mois"
        />
        <input
          type="number"
          value={annee}
          onChange={(e) => setAnnee(Number(e.target.value))}
          className="input"
          placeholder="Année"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isLoading ? 'Génération...' : 'Valider'}
        </button>
      </div>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default BulletinForm;
