import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FolderIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import type { SidebarProps, MenuItem } from '../../../utils/types';


function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const location = useLocation();

  // Fonction pour basculer les dropdowns du menu
  const toggleDropdown = (index: number) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems: MenuItem[] = [

    {
      title: 'Tableau de bord',
      icon: <HomeIcon className="h-5 w-5" />,
      path: '/',
    },
    {
      title: 'Sociétés',
      icon: <BuildingOfficeIcon  className="h-5 w-5" />,
      path: '/societes',
    },
    {
      title: 'Barèmes',
      icon: <ChartBarIcon className="h-5 w-5" />,
      path: '/bareme',
      submenu: [
        { title: 'Catégories', path: '/bareme/categories'},
        { title: 'Echelons', path: '/bareme/echelons'},
        { title: 'Grille Categorie', path: '/bareme/categorie-echelon'},
      ],
    },
    {
      title: 'Catégories',
      icon: <FolderIcon className="h-5 w-5" />,
      path: '/categories',
    },
    {
      title: 'Elements de salaire',
      icon: <FolderIcon className="h-5 w-5" />,
      path: '/elements-salaire',
    },
    {
      title: 'Profils de paie',
      icon: <FolderIcon className="h-5 w-5" />,
      path: '/profil-paie',
    },
    {
      title: 'Rubriques',
      icon: <FolderIcon className="h-5 w-5" />,
      path: '/rubrics',
      /*submenu: [
        { title: 'Liste', path: '/rubrics/list' },
        { title: 'Ajouter', path: '/rubrics/add' },
      ],*/
    },
    {
      title: 'Employés',
      icon: <UsersIcon className="h-5 w-5" />,
      path: '/employees',
      submenu: [
        { title: 'Liste Employés', path: '/employees/list' },
        { title: 'Profils Paie Employés', path: '/employees/employee-payroll-profil' },
      ],
    },
    {
      title: 'Paramètres',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      path: '/settings',
    },
  ];

  // Fonction pour vérifier si un chemin est actif (pour le highlighting)
  const isPathActive = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 bg-gray-800 text-white w-64 flex-shrink-0 fixed lg:static h-full z-10 overflow-y-auto`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between lg:justify-center mb-6">
          <h2 className="text-xl font-bold">Menu</h2>
          <button 
            className="p-2 rounded-md hover:bg-gray-700 lg:hidden"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      className={`flex items-center justify-between w-full px-4 py-2 text-left rounded-md hover:bg-gray-700 ${
                        isPathActive(item.path) ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={activeDropdown === index}
                      aria-controls={`submenu-${index}`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {activeDropdown === index ? (
                        <ChevronUpIcon className="h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                      )}
                    </button>
                    
                    {activeDropdown === index && (
                      <ul id={`submenu-${index}`} className="pl-6 mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block px-4 py-2 rounded-md hover:bg-gray-700 ${
                                location.pathname === subItem.path ? 'bg-gray-700 text-blue-400' : ''
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
                      isPathActive(item.path) ? 'bg-gray-700 text-blue-400' : ''
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;