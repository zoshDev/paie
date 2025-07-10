import React from 'react';
import PageHeader from '../../components/layout/PageHeader';
import GenericForm from '../../components/form/GenericForm';
import useSocieteUnique from './useSocieteUnique';
import { societeFields } from './societeFields';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';

const SocieteUniquePage: React.FC = () => {
  const { societeId } = useParams<{ societeId: string }>();
  const { societe, isLoading, isError } = useSocieteUnique(societeId || 'unique_societe');

  const handleSave = (values: any) => {
    console.log('Enregistrer les informations de la société:', values);
    // TODO: Implémenter la logique de sauvegarde via une mutation
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="Gestion de la Société" description="Modification des informations" />
        <div className="bg-white rounded-md shadow p-6">
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-gray-500">Chargement des informations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="Gestion de la Société" description="Modification des informations" />
        <div className="bg-white rounded-md shadow p-6">
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-16 w-16 text-red-500" />
            <p className="mt-4 text-red-500">Erreur lors du chargement des informations.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!societe) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="Gestion de la Société" description="Modification des informations" />
        <div className="bg-white rounded-md shadow p-6">
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-gray-500">Aucune information de société trouvée.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader title="Gestion de la Société" description="Modification des informations" />
      <div className="bg-white rounded-md shadow p-6">
        <GenericForm
          fields={societeFields}
          initialValues={societe}
          onSubmit={handleSave}
          submitLabel="Enregistrer"
          backgroundIllustration={<BuildingOfficeIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 text-indigo-100 opacity-5 pointer-events-none" />}
        />
      </div>
    </div>
  );
};

export default SocieteUniquePage;