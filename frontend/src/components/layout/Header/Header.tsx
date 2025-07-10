import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { HeaderProps } from '../../../utils/types';
import { useAuthStore } from '../../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header({ toggleSidebar, darkMode, toggleDarkMode }: HeaderProps) {
  
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center lg:justify-start lg:w-1/2">
          <button
            onClick={toggleSidebar}
            className="mr-2 p-2 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Mon Application</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700"
            aria-label="Changer le thème"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={ () => setShowModal(true) }
            className="p-2 rounded-md hover:bg-blue-700 dark:hover:bg-gray-700"
            aria-label="Se déconnecter"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
          <div className="relative">
            <UserCircleIcon className="w-8 h-8 rounded-full cursor-pointer" />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Confirmer la déconnexion</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Voulez-vous vraiment vous déconnecter&nbsp;?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;