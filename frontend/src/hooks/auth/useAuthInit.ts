import { useEffect } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAuthInit() {
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  //const refreshAuth = authService.refreshAuth;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login'];
    if (publicRoutes.includes(location.pathname)) return;
    refreshAuth()
      .then(({ access_token}) => {
        login(access_token);
      })
      .catch(() => {
        logout(); // au cas où refresh échoue
        navigate('/login');
      });
  }, [location.pathname]);
}
