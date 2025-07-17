import { useEffect, useState } from 'react';
import { bulletinService } from '@/components/payroll/bulletinService';

type Bulletin = {
  id: number;
  mois: number;
  annee: number;
  net: number;
};

const BulletinHistory = ({ employeId }: { employeId: string | number }) => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  bulletinService.getByEmployeId(employeId)
    .then((res: BulletinPaie[][]) => {
      const bulletinsFlat = res.flat().map((bpaie): Bulletin => ({
        id: bpaie.id,
        mois: bpaie.mois,
        annee: bpaie.annee,
        net: bpaie.montantNet ?? 0,
      }));
      setBulletins(bulletinsFlat);
    })
    .finally(() => setLoading(false));
}, [employeId]);


  if (loading) return <p>Chargement de l’historique...</p>;
  if (!bulletins.length) return <p>Aucun bulletin trouvé.</p>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Historique des Bulletins</h3>
      <ul className="list-disc ml-6">
        {bulletins.map((b) => (
          <li key={b.id}>
            {b.mois}/{b.annee} – {b.net} FCFA
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletinHistory;
