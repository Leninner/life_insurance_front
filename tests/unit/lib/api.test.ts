import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@/lib/api';
import axios from 'axios';

vi.mock('axios', () => ({
  create: vi.fn(() => ({
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
  })),
}));

vi.mock('localStorage', () => ({
  getItem: vi.fn(),
}));

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear una instancia de axios con la configuración correcta', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('debe configurar el interceptor de solicitud', () => {
    const mockAxiosInstance = {
      interceptors: {
        request: {
          use: vi.fn(),
        },
      },
    };

    (axios.create as any).mockReturnValue(mockAxiosInstance);

    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  it('debe agregar el token de autorización cuando existe en localStorage', () => {
    const mockToken = 'test-token';
    const mockConfig = {
      headers: {},
    };

    (localStorage.getItem as any).mockReturnValue(mockToken);

    const interceptor = (axios.create as any).mock.results[0].value.interceptors.request.use.mock.calls[0][0];
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  it('no debe modificar la configuración cuando no hay token en localStorage', () => {
    const mockConfig = {
      headers: {},
    };

    (localStorage.getItem as any).mockReturnValue(null);

    const interceptor = (axios.create as any).mock.results[0].value.interceptors.request.use.mock.calls[0][0];
    const result = interceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });
}); 