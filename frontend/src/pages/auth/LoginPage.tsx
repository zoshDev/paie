import { useUIStore } from '../../stores/uiStore';
import LoginForm from '../../components/auth/LoginForm';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

function LoginPage() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Bouton switch thème en haut à droite */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-md bg-white/80 dark:bg-gray-800/80 hover:bg-blue-600 hover:text-white transition"
        aria-label="Changer le thème"
        type="button"
      >
        {darkMode ? (
          <SunIcon className="h-6 w-6" />
        ) : (
          <MoonIcon className="h-6 w-6" />
        )}
      </button>
      <LoginForm />
    </div>
  );
}

export default LoginPage;