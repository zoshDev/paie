import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useUIStore } from '../../../stores/uiStore';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import { TITLES } from '../../../utils/types';
//import { useAuthInit } from '../../../hooks/auth/useAuthInit';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../stores/authStore';

export default function Layout() {
  //useAuthInit(); // verifie si on peut refresh automatiquement le token
  const { isTokenExpired, logout } = useAuthStore();

  useEffect(() => {
    if (isTokenExpired()) {
      toast.error('🔒 Votre session a expiré. Veuillez vous reconnecter.');
      logout();
    }
  }, [isTokenExpired]);

  const { sidebarOpen, toggleSidebar, setSidebarOpen, darkMode, toggleDarkMode } = useUIStore();
  const location = useLocation();
  const title = TITLES[location.pathname] || '';

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Contenu principal */}
        <main className="flex-1 flex flex-col overflow-y-auto p-6 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="overflow-y-auto max-w-7xl flex flex-col mx-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 flex-1 min-h-0 w-full">
            {title && <h1 className='text-2xl font-bold mb-6'>{title}</h1>}
            <Outlet />
          </div>
        </main>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}