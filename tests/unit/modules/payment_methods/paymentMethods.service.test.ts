import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentMethodsService } from '@/modules/payment_methods/paymentMethods.service';
import { api } from '@/lib/api';
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces';

// Mock de la API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('paymentMethodsService', () => {
  const mockPaymentMethod = {
    id: '1',
    type: PaymentMethodType.CREDIT_CARD,
    details: {
      cardNumber: '4111111111111111',
      cardHolderName: 'JOHN DOE',
      cardExpirationDate: '1225',
      cardCvv: '123',
    },
    isValid: true,
    isDefault: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener todos los métodos de pago', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockPaymentMethod],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    });

    const result = await paymentMethodsService.getPaymentMethods();

    expect(api.get).toHaveBeenCalledWith('/payment-methods', { params: undefined });
    expect(result).toEqual({
      data: [mockPaymentMethod],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  });

  it('debe obtener todos los métodos de pago con parámetros de consulta', async () => {
    const params = { page: 2, limit: 20 };
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockPaymentMethod],
        meta: {
          total: 1,
          page: 2,
          limit: 20,
        },
      },
    });

    const result = await paymentMethodsService.getPaymentMethods(params);

    expect(api.get).toHaveBeenCalledWith('/payment-methods', { params });
    expect(result).toEqual({
      data: [mockPaymentMethod],
      meta: {
        total: 1,
        page: 2,
        limit: 20,
      },
    });
  });

  it('debe parsear correctamente los detalles de la tarjeta', async () => {
    const mockResponse = {
      data: {
        data: [{
          ...mockPaymentMethod,
          details: JSON.stringify(mockPaymentMethod.details),
        }],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    };

    (api.get as any).mockResolvedValueOnce(mockResponse);

    const result = await paymentMethodsService.getPaymentMethods();

    expect(result.data[0].details).toEqual(mockPaymentMethod.details);
  });

  it('debe obtener un método de pago por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: mockPaymentMethod,
      },
    });

    const result = await paymentMethodsService.getPaymentMethod('1');

    expect(api.get).toHaveBeenCalledWith('/payment-methods/1');
    expect(result).toEqual(mockPaymentMethod);
  });

  it('debe crear un nuevo método de pago', async () => {
    const newPaymentMethod = {
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      },
      isDefault: true,
    };

    (api.post as any).mockResolvedValueOnce({
      data: {
        data: { ...newPaymentMethod, id: '2' },
      },
    });

    const result = await paymentMethodsService.createPaymentMethod(newPaymentMethod);

    expect(api.post).toHaveBeenCalledWith('/payment-methods', {
      ...newPaymentMethod,
      details: JSON.stringify(newPaymentMethod.details),
    });
    expect(result).toEqual({ ...newPaymentMethod, id: '2' });
  });

  it('debe actualizar un método de pago existente', async () => {
    const updatedPaymentMethod = {
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JANE DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      },
      isDefault: false,
    };

    (api.put as any).mockResolvedValueOnce({
      data: {
        data: { ...updatedPaymentMethod, id: '1' },
      },
    });

    const result = await paymentMethodsService.updatePaymentMethod('1', updatedPaymentMethod);

    expect(api.put).toHaveBeenCalledWith('/payment-methods/1', {
      ...updatedPaymentMethod,
      details: JSON.stringify(updatedPaymentMethod.details),
    });
    expect(result).toEqual({ ...updatedPaymentMethod, id: '1' });
  });

  it('debe actualizar un método de pago sin modificar los detalles', async () => {
    const updatedPaymentMethod = {
      isDefault: false,
    };

    (api.put as any).mockResolvedValueOnce({
      data: {
        data: { ...mockPaymentMethod, ...updatedPaymentMethod },
      },
    });

    const result = await paymentMethodsService.updatePaymentMethod('1', updatedPaymentMethod);

    expect(api.put).toHaveBeenCalledWith('/payment-methods/1', updatedPaymentMethod);
    expect(result).toEqual({ ...mockPaymentMethod, ...updatedPaymentMethod });
  });

  it('debe eliminar un método de pago', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    await paymentMethodsService.deletePaymentMethod('1');

    expect(api.delete).toHaveBeenCalledWith('/payment-methods/1');
  });

  it('debe manejar errores al obtener métodos de pago', async () => {
    const error = new Error('Error al obtener métodos de pago');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(paymentMethodsService.getPaymentMethods()).rejects.toThrow('Error al obtener métodos de pago');
  });

  it('debe manejar errores al obtener un método de pago', async () => {
    const error = new Error('Error al obtener método de pago');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(paymentMethodsService.getPaymentMethod('1')).rejects.toThrow('Error al obtener método de pago');
  });

  it('debe manejar errores al crear un método de pago', async () => {
    const error = new Error('Error al crear método de pago');
    (api.post as any).mockRejectedValueOnce(error);

    const newPaymentMethod = {
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      },
      isDefault: true,
    };

    await expect(paymentMethodsService.createPaymentMethod(newPaymentMethod)).rejects.toThrow('Error al crear método de pago');
  });

  it('debe manejar errores al actualizar un método de pago', async () => {
    const error = new Error('Error al actualizar método de pago');
    (api.put as any).mockRejectedValueOnce(error);

    const updatedPaymentMethod = {
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '4111111111111111',
        cardHolderName: 'JANE DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      },
      isDefault: false,
    };

    await expect(paymentMethodsService.updatePaymentMethod('1', updatedPaymentMethod)).rejects.toThrow('Error al actualizar método de pago');
  });

  it('debe manejar errores al eliminar un método de pago', async () => {
    const error = new Error('Error al eliminar método de pago');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(paymentMethodsService.deletePaymentMethod('1')).rejects.toThrow('Error al eliminar método de pago');
  });
}); 