import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthService } from '@/modules/auth/useAuth';
import { useAuthStore } from '@/modules/auth/auth.store';
import { RoleType } from '@/modules/auth/auth.interfaces';

// Mock del store de autenticación
vi.mock('@/modules/auth/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

// Mock de sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useAuthService', () => {
  const mockLogin = vi.fn();
  const mockRegister = vi.fn();
  const mockLogout = vi.fn();
  const mockClearError = vi.fn();
  const mockCompleteOnboarding = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      logout: mockLogout,
      clearError: mockClearError,
      completeOnboarding: mockCompleteOnboarding,
      user: null,
    });
  });

  it('debe proporcionar las funciones de autenticación', () => {
    const auth = useAuthService();

    expect(auth.login).toBeDefined();
    expect(auth.register).toBeDefined();
    expect(auth.logout).toBeDefined();
    expect(auth.clearError).toBeDefined();
    expect(auth.completeOnboarding).toBeDefined();
  });

  it('debe manejar el inicio de sesión correctamente', async () => {
    const auth = useAuthService();
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    await auth.login(credentials);

    expect(mockLogin).toHaveBeenCalledWith(credentials);
  });

  it('debe manejar el registro correctamente', async () => {
    const auth = useAuthService();
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: RoleType.CLIENT,
    };

    await auth.register(userData);

    expect(mockRegister).toHaveBeenCalledWith(userData);
  });

  it('debe manejar el cierre de sesión correctamente', async () => {
    const auth = useAuthService();

    await auth.logout();

    expect(mockLogout).toHaveBeenCalled();
  });

  it('debe manejar el onboarding correctamente', async () => {
    const auth = useAuthService();
    const onboardingData = {
      birthDate: '1990-01-01',
      booldType: 'A+',
      gender: 'MALE',
      height: 180,
      weight: 80,
      smoker: false,
      hasChildren: false,
      hasDiseases: false,
      hasFamilyDiseases: false,
    };

    await auth.completeOnboarding(onboardingData);

    expect(mockCompleteOnboarding).toHaveBeenCalledWith(onboardingData);
  });

  it('debe verificar permisos correctamente', () => {
    const auth = useAuthService();
    expect(auth.hasPermission()).toBe(false);

    (useAuthStore as any).mockReturnValue({
      user: { id: '1', name: 'Test User' },
    });

    const authWithUser = useAuthService();
    expect(authWithUser.hasPermission()).toBe(true);
  });
}); 