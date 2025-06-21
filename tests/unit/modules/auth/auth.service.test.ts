import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authServices } from '@/modules/auth/auth.service';
import { getHttpClient } from '@/lib/http';

// Mock del cliente HTTP
vi.mock('@/lib/http', () => ({
  getHttpClient: vi.fn().mockResolvedValue({
    post: vi.fn(),
    get: vi.fn(),
  }),
}));

describe('AuthService', () => {
  const mockApi = {
    post: vi.fn(),
    get: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getHttpClient as any).mockResolvedValue(mockApi);
  });

  describe('login', () => {
    it('debe llamar al endpoint correcto con las credenciales', async () => {
      const mockResponse = { data: { token: 'test-token', user: {} } };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await authServices.login('test@example.com', 'password123');

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getUser', () => {
    it('debe llamar al endpoint correcto', async () => {
      const mockResponse = { data: { user: {} } };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await authServices.getUser();

      expect(mockApi.get).toHaveBeenCalledWith('/auth/user');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('register', () => {
    it('debe llamar al endpoint correcto con los datos del usuario', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT',
      };
      const mockResponse = { data: { token: 'test-token', user: {} } };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await authServices.register(userData);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('debe llamar al endpoint correcto', async () => {
      const mockResponse = { data: { success: true } };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await authServices.logout();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('completeOnboarding', () => {
    it('debe llamar al endpoint correcto con los datos de onboarding', async () => {
      const onboardingData = {
        // Agrega aquí los datos necesarios para el onboarding
      };
      const mockResponse = { data: { success: true } };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await authServices.completeOnboarding(onboardingData);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/onboarding', onboardingData);
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 