import type { BulletinPaie } from './bulletin';

const BulletinViewer = ({ bulletin }: { bulletin: BulletinPaie }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bulletin de Paie du {bulletin.mois}/{bulletin.annee}</h3>
      <p>Net à payer : <strong>{bulletin.montantNet} FCFA</strong></p>

      <table className="w-full border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 text-left">Rubrique</th>
            <th>Employé</th>
            <th>Employeur</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {bulletin.lignes.map((ligne, idx) => (
            <tr key={idx}>
              <td className="px-2 py-1">{ligne.nom}</td>
              <td>{ligne.montantEmploye} FCFA</td>
              <td>{ligne.montantEmployeur} FCFA</td>
              <td>{ligne.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BulletinViewer;
