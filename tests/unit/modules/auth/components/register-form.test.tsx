import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterForm } from '@/modules/auth/components/register-form';
import { useAuthService } from '../../../../mocks/useAuth';
import { RoleType } from '@/modules/auth/auth.interfaces';

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

describe('RegisterForm', () => {
  const mockRegister = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthService().register = mockRegister;
  });

  it('renderiza correctamente el formulario de registro', () => {
    render(<RegisterForm />);
    
    expect(screen.getByText('Crear una cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('maneja el envío del formulario correctamente', async () => {
    render(<RegisterForm />);
    
    const nameInput = screen.getByLabelText('Nombre completo');
    const emailInput = screen.getByLabelText('Correo electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: 'Registrarse' });

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(mockRegister).toHaveBeenCalledWith(
      {
        name: 'Juan Pérez',
        email: 'test@example.com',
        password: 'password123',
        role: RoleType.CLIENT,
      },
      expect.any(Object)
    );
  });

  it('muestra el estado de carga durante el registro', () => {
    useAuthService().isRegistering = true;
    render(<RegisterForm />);
    
    expect(screen.getByRole('button', { name: 'Registrando...' })).toBeInTheDocument();
  });
}); 