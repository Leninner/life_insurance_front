import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '@/modules/auth/components/login-form';
import { useAuthService } from '../../../../mocks/useAuth';

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock del hook useAuth
vi.mock('@/modules/auth/useAuth', () => ({
  useAuthService,
}));

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthService().login = mockLogin;
  });

  it('renderiza correctamente el formulario de login', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Bienvenido de nuevo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  it('maneja el envío del formulario correctamente', async () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.any(Object)
    );
  });

  it('muestra el estado de carga durante el inicio de sesión', () => {
    useAuthService().isLoggingIn = true;
    render(<LoginForm />);
    
    expect(screen.getByRole('button', { name: 'Iniciando sesión...' })).toBeInTheDocument();
  });
}); 