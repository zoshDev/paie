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
      //const response = await authService.login(data);
      const response = { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjA5Mjk1MjAsImlhdCI6MTY4OTM5MDcxMywic3ViIjoiMTIzNDU2Nzg5MCIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJDZWxpd2UiLCJlbWFpbCI6ImNlbGl3ZS5rb250aUBleGFtcGxlLmNvbSIsInBob25lTnVtYmVyIjoiKzIzNzY3NTQzMjEwMCIsInBzZXVkbyI6IkFsdGhpYSJ9.W_7M1nQ5R3G2J8K6X9L7P0O1V2U3T4S5R6Q7P8N9M0' }; // Simulated response

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
