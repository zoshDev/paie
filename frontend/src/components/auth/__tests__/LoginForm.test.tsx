// ❗ Important : le mock doit être défini AVANT l'import du composant
import { vi } from 'vitest';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

vi.spyOn(authService, 'login').mockResolvedValue({
  access_token: 'fake-token',
  token_type: 'Bearer',
});

const loginSpy = vi.spyOn(useAuthStore.getState(), 'login');

// 👉 Import du reste après le mock
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

describe('🧪 LoginForm — test d’intégration', () => {
  it('connecte un utilisateur et met à jour le store Zustand', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Saisie du pseudo et du mot de passe
    fireEvent.change(screen.getByPlaceholderText(/pseudo/i), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText(/mot de passe/i), {
      target: { value: 'admin123' },
    });

    // Soumission du formulaire
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Vérification de l'appel à login()
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'admin',
        password: 'admin123',
      });

      expect(loginSpy).toHaveBeenCalledWith('fake-token');
    });
  });

});
