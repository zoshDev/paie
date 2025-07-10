import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  // Appliquer le mode sombre par défaut
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Navigation items avec leurs labels et routes
  const navigationItems = [
    { label: 'Employés', path: '/employees' },
    { label: 'Profils de paie', path: '/examples/payroll-profiles' },
    { label: 'Exemple de liste', path: '/examples/list' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header avec titre et navigation */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Système de Paie</h1>
              </div>
              
              {/* Navigation principale */}
              <nav className="ml-8 flex space-x-4 items-center">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-gray-900 text-white dark:bg-blue-600'
                        : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Section utilisateur */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Utilisateur
                </span>
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  U
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow mt-auto py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Système de Paie - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 