import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { loginSchema, type LoginFormData } from '../../schemas/auth/login.schema';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

export function useLoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      const response = await authService.login(data);

      login(response.access_token); // ✅ Appel de la méthode du store Zustand
      
      navigate('/');
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return {
    form,
    onSubmit,
    error,
  };
}
