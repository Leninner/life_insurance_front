import { describe, it, expect } from 'vitest';
import { handleHttpError, handleFormError } from '@/lib/http/error-handler';
import { HttpError, FormError } from '@/lib/http/types';

describe('error-handler', () => {
  describe('handleHttpError', () => {
    it('debe manejar errores genéricos', () => {
      const error = new Error('Error de prueba');
      const result = handleHttpError(error);
      expect(result.message).toBe('Error de prueba');
    });

    it('debe manejar errores de autenticación (401)', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      };
      const result = handleHttpError(error);
      expect(result.message).toBe('Se requiere autenticación');
      expect(result.status).toBe(401);
    });

    it('debe manejar errores de autorización (403)', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'Forbidden',
          },
        },
      };
      const result = handleHttpError(error);
      expect(result.message).toBe('No tienes permisos para realizar esta acción');
      expect(result.status).toBe(403);
    });

    it('debe manejar errores de recurso no encontrado (404)', () => {
      const error = {
        response: {
          status: 404,
          data: {
            message: 'Not Found',
          },
        },
      };
      const result = handleHttpError(error);
      expect(result.message).toBe('No se encontró el recurso');
      expect(result.status).toBe(404);
    });

    it('debe manejar errores desconocidos', () => {
      const error = {};
      const result = handleHttpError(error);
      expect(result.message).toBe('An unexpected error occurred');
    });

    it('debe incluir los datos de la respuesta en el error', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Bad Request',
            errors: {
              field: ['Error en el campo'],
            },
          },
        },
      };
      const result = handleHttpError(error);
      expect(result.data).toEqual(error.response.data);
    });
  });

  describe('handleFormError', () => {
    it('debe manejar errores de validación de formulario (422)', () => {
      const error = {
        response: {
          status: 422,
          data: {
            errors: {
              email: ['El email no es válido'],
              password: ['La contraseña es requerida'],
            },
          },
        },
      };
      const result = handleFormError(error);
      expect(result).toEqual({
        email: ['El email no es válido'],
        password: ['La contraseña es requerida'],
      });
    });

    it('debe retornar null para errores que no son de validación', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Bad Request',
          },
        },
      };
      const result = handleFormError(error);
      expect(result).toBeNull();
    });

    it('debe retornar null para errores sin respuesta', () => {
      const error = new Error('Error de prueba');
      const result = handleFormError(error);
      expect(result).toBeNull();
    });

    it('debe retornar null para errores sin datos de validación', () => {
      const error = {
        response: {
          status: 422,
          data: {
            message: 'Validation Error',
          },
        },
      };
      const result = handleFormError(error);
      expect(result).toBeNull();
    });
  });
}); 