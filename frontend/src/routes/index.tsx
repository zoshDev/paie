import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/layout/Layout';
import EmployeePayrollProfilePage from '../pages/employee/EmployeePayrollProfilePage';
import EmployeesListPage from '../pages/employee/EmployeesListPage';
//import ProfilPaieListPage from '../pages/profilPaie/ProfilPaieListPage';
//import RubricsListPage from '../pages/rubric/RubricListPage';

import SettingsPage from '../pages/settings/setingsPage';
import DashboardPages from '../pages/dashboard/dashboardPage';
import LoginPage from '../pages/auth/LoginPage';
import PrivateRoute from '../components/auth/PrivateRoute';
//import TestRubricForm from '../pages/TestRubricForm';

import CompaniesListPage from '@/pages/company/CompaniesListPage';
import EchelonListPage from '@/pages/echelon/EchelonListPage';
import CategorieListPage from '@/pages/categoriess/CategorieListPage';
import CategorieEchelonGrid from '@/pages/categorieEchelon/CategorieEchelonGrid'; //import CategorieEchelonGrid from '@/pages/bareme/CategorieEchelonGrid';
import ElementSalaireListPage from '@/pages/elementSalaire/ElementSalaireListPage';
import RoleProfilPaieListPage from '@/pages/roleProfilPaie/RoleProfilPaieListPage';
import VariableListPage from '@/pages/variable/VariableListPage';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <DashboardPages />,
          },
          {
            path: 'employees',
            children: [ 
              {
                path: 'list',
                element: <EmployeesListPage />,
              },
              {
                path: 'employee-payroll-profil',
                element: <EmployeePayrollProfilePage />
              }
            ]
          },
          /*{
            path: 'rubrics/',
            element: <RubricsListPage />,
          },*/
          /*{
            path: 'test-rubric-form',
            element: <TestRubricForm />,
          },*/
          
          {
            path: 'profilpaie',
            element: <RoleProfilPaieListPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'societes',
            element: <CompaniesListPage />,
          },
          {
            path: 'rubriques',
            children: [ 
              {
                path: '/rubriques/variables',
                element: <VariableListPage />,
              },
              {
                path: '/rubriques/elements-salaire',
                element: <ElementSalaireListPage />
              },
            ]
          },
          {
            path: 'bareme',
            children: [ 
              {
                path: '/bareme/categories',
                element: <CategorieListPage />,
              },
              {
                path: '/bareme/echelons',
                element: <EchelonListPage />
              },
              {
                path: '/bareme/categorie-echelon',
                element: <CategorieEchelonGrid />
              }
            ]
          },
        ],
      },
    ],
  },
]);

export default router;

//Grille Categorie