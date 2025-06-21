import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '@/modules/auth/auth.store';
import { authServices } from '@/modules/auth/auth.service';
import { RoleType } from '@/modules/auth/auth.interfaces';

// Mock del servicio de autenticación
vi.mock('@/modules/auth/auth.service', () => ({
  authServices: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    completeOnboarding: vi.fn(),
  },
}));

describe('AuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hydrated: false,
    });
  });

  describe('login', () => {
    it('debe actualizar el estado correctamente al iniciar sesión exitosamente', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: {
              name: RoleType.CLIENT,
              permissions: [],
            },
          },
        },
      };

      (authServices.login as any).mockResolvedValueOnce(mockResponse);

      await useAuthStore.getState().login({
        email: 'test@example.com',
        password: 'password123',
      });

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('test-token');
      expect(state.user).toEqual(mockResponse.data.user);
    });

    it('debe manejar errores durante el inicio de sesión', async () => {
      const error = new Error('Invalid credentials');
      (authServices.login as any).mockRejectedValueOnce(error);

      await useAuthStore.getState().login({
        email: 'test@example.com',
        password: 'wrong-password',
      });

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Invalid credentials');
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('register', () => {
    it('debe actualizar el estado correctamente al registrarse exitosamente', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            role: {
              name: RoleType.CLIENT,
              permissions: [],
            },
          },
        },
      };

      (authServices.register as any).mockResolvedValueOnce(mockResponse);

      await useAuthStore.getState().register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: RoleType.CLIENT,
      });

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('test-token');
      expect(state.user).toEqual(mockResponse.data.user);
    });
  });

  describe('logout', () => {
    it('debe limpiar el estado al cerrar sesión', () => {
      useAuthStore.setState({
        user: { id: 1, name: 'Test User' },
        token: 'test-token',
        isAuthenticated: true,
      });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('initializeAuth', () => {
    it('debe inicializar el estado correctamente cuando hay un token y usuario', () => {
      useAuthStore.setState({
        token: 'test-token',
        user: { id: 1, name: 'Test User' },
        hydrated: false,
      });

      useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.hydrated).toBe(true);
    });

    it('debe inicializar el estado correctamente cuando no hay token ni usuario', () => {
      useAuthStore.setState({
        token: null,
        user: null,
        hydrated: false,
      });

      useAuthStore.getState().initializeAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.hydrated).toBe(true);
    });
  });
}); 