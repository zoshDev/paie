import { useUIStore } from '../../stores/uiStore';
import { useLoginForm } from '../../hooks/auth/useLoginForm';

import {
  LockClosedIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';



function LoginForm() {
  const { darkMode } = useUIStore();
  const { form, onSubmit, error } = useLoginForm();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;
 
  return (
    <div className={`min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 mb-4">
            <LockClosedIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold">
            Connexion
          </h2>
          <p className={`mt-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Accédez à votre compte
          </p>
        </div>

        {/* Formulaire */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username')}
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500 text-gray-900'} rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10`}
                placeholder="Pseudonyme / nom d'utilisateur"
              />
              {errors.username && (
                <span className="text-xs text-red-500">{errors.username.message}</span>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={`appearance-none rounded-none relative block w-full px-3 py-3 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-500 text-gray-900'} rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10`}
                placeholder="Mot de passe"
              />
              {errors.password && (
                <span className="text-xs text-red-500">{errors.password.message}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                </span>
              )}
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
        </form>

        {/*<div className="text-center mt-4">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Vous n'avez pas de compte?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              S'inscrire
            </a>
          </p>
        </div>*/}
      </div>
    </div>
  );
}

export default LoginForm;