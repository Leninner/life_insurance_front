import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HttpClient } from '@/lib/http/http-client';
import axios from 'axios';
import { handleHttpError } from '@/lib/http/error-handler';

vi.mock('axios', () => ({
  create: vi.fn(() => ({
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  })),
}));

vi.mock('@/lib/http/error-handler', () => ({
  handleHttpError: vi.fn(),
}));

vi.mock('localStorage', () => ({
  getItem: vi.fn(),
}));

describe('HttpClient', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    vi.clearAllMocks();
    httpClient = new HttpClient();
  });

  describe('constructor', () => {
    it('debe crear una instancia de axios con la configuración por defecto', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    });

    it('debe configurar los interceptores', () => {
      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe('setAuthToken', () => {
    it('debe establecer el token de autorización', () => {
      const token = 'test-token';
      httpClient.setAuthToken(token);
      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });
  });

  describe('removeAuthToken', () => {
    it('debe eliminar el token de autorización', () => {
      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      httpClient.removeAuthToken();
      expect(mockAxiosInstance.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('métodos HTTP', () => {
    const mockResponse = {
      data: { test: 'data' },
      status: 200,
      headers: { 'content-type': 'application/json' },
    };

    beforeEach(() => {
      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      mockAxiosInstance.get.mockResolvedValue(mockResponse);
      mockAxiosInstance.post.mockResolvedValue(mockResponse);
      mockAxiosInstance.put.mockResolvedValue(mockResponse);
      mockAxiosInstance.patch.mockResolvedValue(mockResponse);
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);
    });

    it('debe realizar una petición GET', async () => {
      const response = await httpClient.get('/test');
      expect(response).toEqual({
        data: mockResponse.data,
        status: mockResponse.status,
        headers: mockResponse.headers,
      });
    });

    it('debe realizar una petición POST', async () => {
      const data = { test: 'data' };
      const response = await httpClient.post('/test', data);
      expect(response).toEqual({
        data: mockResponse.data,
        status: mockResponse.status,
        headers: mockResponse.headers,
      });
    });

    it('debe realizar una petición PUT', async () => {
      const data = { test: 'data' };
      const response = await httpClient.put('/test', data);
      expect(response).toEqual({
        data: mockResponse.data,
        status: mockResponse.status,
        headers: mockResponse.headers,
      });
    });

    it('debe realizar una petición PATCH', async () => {
      const data = { test: 'data' };
      const response = await httpClient.patch('/test', data);
      expect(response).toEqual({
        data: mockResponse.data,
        status: mockResponse.status,
        headers: mockResponse.headers,
      });
    });

    it('debe realizar una petición DELETE', async () => {
      const response = await httpClient.delete('/test');
      expect(response).toEqual({
        data: mockResponse.data,
        status: mockResponse.status,
        headers: mockResponse.headers,
      });
    });
  });

  describe('manejo de errores', () => {
    const mockError = new Error('Test error');

    beforeEach(() => {
      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      mockAxiosInstance.get.mockRejectedValue(mockError);
      (handleHttpError as any).mockReturnValue(mockError);
    });

    it('debe manejar errores en peticiones GET', async () => {
      await expect(httpClient.get('/test')).rejects.toThrow('Test error');
      expect(handleHttpError).toHaveBeenCalledWith(mockError);
    });
  });

  describe('interceptores', () => {
    it('debe agregar el token de autorización a las peticiones', () => {
      const mockToken = 'test-token';
      const mockConfig = {
        headers: {},
      };

      (localStorage.getItem as any).mockReturnValue(JSON.stringify({ state: { token: mockToken } }));

      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const result = requestInterceptor(mockConfig);

      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it('debe redirigir a /login en caso de error 401', () => {
      const mockError = {
        response: {
          status: 401,
        },
      };

      const mockAxiosInstance = (axios.create as any).mock.results[0].value;
      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[1][1];
      
      // Mock window.location
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: '' } as any;

      responseInterceptor(mockError);

      expect(window.location.href).toBe('/login');

      // Restore window.location
      window.location = originalLocation;
    });
  });
}); 