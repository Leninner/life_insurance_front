import { describe, it, expect } from 'vitest';
import { HttpClientConfig, HttpResponse, HttpError, FormError, IHttpClient } from '@/lib/http/types';

describe('http types', () => {
  describe('HttpClientConfig', () => {
    it('debe tener las propiedades requeridas', () => {
      const config: HttpClientConfig = {
        baseURL: 'http://api.example.com',
      };
      expect(config).toHaveProperty('baseURL');
    });

    it('puede tener propiedades opcionales', () => {
      const config: HttpClientConfig = {
        baseURL: 'http://api.example.com',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        },
        retries: 3,
        rateLimit: 100,
      };
      expect(config.timeout).toBe(5000);
      expect(config.headers).toBeDefined();
      expect(config.retries).toBe(3);
      expect(config.rateLimit).toBe(100);
    });
  });

  describe('HttpResponse', () => {
    it('debe tener las propiedades requeridas', () => {
      const response: HttpResponse = {
        data: { test: 'data' },
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      };
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('headers');
    });

    it('puede tener datos genéricos', () => {
      interface TestData {
        id: number;
        name: string;
      }

      const response: HttpResponse<TestData> = {
        data: {
          id: 1,
          name: 'Test',
        },
        status: 200,
        headers: {},
      };
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('Test');
    });
  });

  describe('HttpError', () => {
    it('debe tener la propiedad message requerida', () => {
      const error: HttpError = {
        message: 'Error de prueba',
      };
      expect(error).toHaveProperty('message');
    });

    it('puede tener propiedades opcionales', () => {
      const error: HttpError = {
        message: 'Error de prueba',
        status: 400,
        data: {
          field: 'error',
        },
      };
      expect(error.status).toBe(400);
      expect(error.data).toBeDefined();
    });
  });

  describe('FormError', () => {
    it('debe tener errores por campo', () => {
      const formError: FormError = {
        email: ['El email es requerido', 'El email no es válido'],
        password: ['La contraseña es requerida'],
      };
      expect(formError.email).toHaveLength(2);
      expect(formError.password).toHaveLength(1);
    });
  });

  describe('IHttpClient', () => {
    it('debe definir los métodos HTTP', () => {
      const httpClient: IHttpClient = {
        get: async <T>() => ({ data: {} as T, status: 200, headers: {} }),
        post: async <T>() => ({ data: {} as T, status: 200, headers: {} }),
        put: async <T>() => ({ data: {} as T, status: 200, headers: {} }),
        patch: async <T>() => ({ data: {} as T, status: 200, headers: {} }),
        delete: async <T>() => ({ data: {} as T, status: 200, headers: {} }),
        setAuthToken: () => {},
        removeAuthToken: () => {},
      };

      expect(httpClient.get).toBeDefined();
      expect(httpClient.post).toBeDefined();
      expect(httpClient.put).toBeDefined();
      expect(httpClient.patch).toBeDefined();
      expect(httpClient.delete).toBeDefined();
      expect(httpClient.setAuthToken).toBeDefined();
      expect(httpClient.removeAuthToken).toBeDefined();
    });

    it('debe manejar tipos genéricos en los métodos HTTP', async () => {
      interface TestData {
        id: number;
        name: string;
      }

      const httpClient: IHttpClient = {
        get: async <T>() => ({
          data: { id: 1, name: 'Test' } as T,
          status: 200,
          headers: {},
        }),
        post: async <T>() => ({
          data: { id: 1, name: 'Test' } as T,
          status: 200,
          headers: {},
        }),
        put: async <T>() => ({
          data: { id: 1, name: 'Test' } as T,
          status: 200,
          headers: {},
        }),
        patch: async <T>() => ({
          data: { id: 1, name: 'Test' } as T,
          status: 200,
          headers: {},
        }),
        delete: async <T>() => ({
          data: { id: 1, name: 'Test' } as T,
          status: 200,
          headers: {},
        }),
        setAuthToken: () => {},
        removeAuthToken: () => {},
      };

      const response = await httpClient.get<TestData>('/test');
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
    });
  });
}); 