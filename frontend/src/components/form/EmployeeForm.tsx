import { useEmployeeForm } from '@/hooks/useEmployeeForm';

export function EmployeeForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useEmployeeForm(onSubmit);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('matricule')} placeholder="Matricule" />
      {errors.matricule && <p>{errors.matricule.message}</p>}

      <input {...register('statutFamilial')} placeholder="Statut familial" />
      <input type="number" {...register('nbEnfants')} placeholder="Nombre d'enfants" />
      <input {...register('nationalite')} placeholder="Nationalité" />
      <input type="checkbox" {...register('estLoge')} />
      <input type="number" {...register('societeId')} placeholder="Société ID" />
      <input type="number" {...register('categorieEchelonId')} placeholder="Catégorie Echelon ID" />
      <input {...register('pseudo')} placeholder="Pseudo" />
      <input type="password" {...register('password')} placeholder="Mot de passe" />
      <input type="number" {...register('roleId.0')} placeholder="Role ID" />
      
      <button type="submit">Créer l’employé</button>
    </form>
  );
}
