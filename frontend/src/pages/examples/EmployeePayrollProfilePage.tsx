import { useState } from 'react';
import { useExamplePayrollProfileStore } from '../../stores/examplePayrollProfileStore';

export default function EmployeePayrollProfilePage() {
  const { profiles, employeeProfiles, assignProfileToEmployee } = useExamplePayrollProfileStore();
  
  // Mock employees data
  const employees = [
    { id: 'emp1', name: 'Jean Dupont', department: 'IT', position: 'Développeur' },
    { id: 'emp2', name: 'Marie Martin', department: 'RH', position: 'Responsable RH' },
    { id: 'emp3', name: 'Pierre Durand', department: 'Finance', position: 'Comptable' },
  ];

  // State for the selected profile in the dropdown
  const [selectedProfiles, setSelectedProfiles] = useState<Record<string, string>>({
    emp1: employeeProfiles.find(ep => ep.employeeId === 'emp1')?.profileId || '',
    emp2: employeeProfiles.find(ep => ep.employeeId === 'emp2')?.profileId || '',
    emp3: employeeProfiles.find(ep => ep.employeeId === 'emp3')?.profileId || '',
  });

  // Handle profile change
  const handleProfileChange = (employeeId: string, profileId: string) => {
    setSelectedProfiles(prev => ({
      ...prev,
      [employeeId]: profileId
    }));
    
    assignProfileToEmployee(employeeId, profileId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profils de paie des employés</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Assignez des profils de paie aux employés et personnalisez-les selon leurs besoins spécifiques.
      </p>
      
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Employé
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Département
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Poste
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Profil de paie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {employees.map((employee) => {
              const employeeProfile = employeeProfiles.find(ep => ep.employeeId === employee.id);
              const currentProfileId = selectedProfiles[employee.id] || '';
              const currentProfile = profiles.find(p => p.id === currentProfileId);
              
              return (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={currentProfileId}
                      onChange={(e) => handleProfileChange(employee.id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Sélectionner un profil</option>
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.name} {profile.isDefault ? '(Standard)' : ''}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {currentProfileId && (
                      <button
                        onClick={() => {
                          console.log(`Customize profile for ${employee.name}`);
                          // This would open a customization modal in a real implementation
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Personnaliser
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 