import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentsService } from '@/modules/payments/payments.service';
import { api } from '@/lib/api';
import { PaymentStatus } from '@/modules/payments/payments.interface';

// Mock de la API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('paymentsService', () => {
  const mockPayment = {
    id: '1',
    status: PaymentStatus.PENDING,
    details: {
      amount: 1000,
      currency: 'USD',
      description: 'Pago de seguro',
      paymentMethodId: '1',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener todos los pagos', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockPayment],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    });

    const result = await paymentsService.getPayments();

    expect(api.get).toHaveBeenCalledWith('/payments', { params: undefined });
    expect(result).toEqual({
      data: [mockPayment],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  });

  it('debe obtener todos los pagos con parámetros de consulta', async () => {
    const params = { page: 2, limit: 20 };
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockPayment],
        meta: {
          total: 1,
          page: 2,
          limit: 20,
        },
      },
    });

    const result = await paymentsService.getPayments(params);

    expect(api.get).toHaveBeenCalledWith('/payments', { params });
    expect(result).toEqual({
      data: [mockPayment],
      meta: {
        total: 1,
        page: 2,
        limit: 20,
      },
    });
  });

  it('debe obtener un pago por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: mockPayment,
      },
    });

    const result = await paymentsService.getPayment('1');

    expect(api.get).toHaveBeenCalledWith('/payments/1');
    expect(result).toEqual(mockPayment);
  });

  it('debe crear un nuevo pago', async () => {
    const newPayment = {
      details: {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      },
    };

    (api.post as any).mockResolvedValueOnce({
      data: {
        data: { ...newPayment, id: '2', status: PaymentStatus.PENDING },
      },
    });

    const result = await paymentsService.createPayment(newPayment);

    expect(api.post).toHaveBeenCalledWith('/payments', newPayment);
    expect(result).toEqual({ ...newPayment, id: '2', status: PaymentStatus.PENDING });
  });

  it('debe actualizar un pago existente', async () => {
    const updatedPayment = {
      status: PaymentStatus.COMPLETED,
    };

    (api.put as any).mockResolvedValueOnce({
      data: {
        data: { ...mockPayment, ...updatedPayment },
      },
    });

    const result = await paymentsService.updatePayment('1', updatedPayment);

    expect(api.put).toHaveBeenCalledWith('/payments/1', updatedPayment);
    expect(result).toEqual({ ...mockPayment, ...updatedPayment });
  });

  it('debe eliminar un pago', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    await paymentsService.deletePayment('1');

    expect(api.delete).toHaveBeenCalledWith('/payments/1');
  });

  it('debe manejar errores al obtener pagos', async () => {
    const error = new Error('Error al obtener pagos');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(paymentsService.getPayments()).rejects.toThrow('Error al obtener pagos');
  });

  it('debe manejar errores al obtener un pago', async () => {
    const error = new Error('Error al obtener pago');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(paymentsService.getPayment('1')).rejects.toThrow('Error al obtener pago');
  });

  it('debe manejar errores al crear un pago', async () => {
    const error = new Error('Error al crear pago');
    (api.post as any).mockRejectedValueOnce(error);

    const newPayment = {
      details: {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      },
    };

    await expect(paymentsService.createPayment(newPayment)).rejects.toThrow('Error al crear pago');
  });

  it('debe manejar errores al actualizar un pago', async () => {
    const error = new Error('Error al actualizar pago');
    (api.put as any).mockRejectedValueOnce(error);

    const updatedPayment = {
      status: PaymentStatus.COMPLETED,
    };

    await expect(paymentsService.updatePayment('1', updatedPayment)).rejects.toThrow('Error al actualizar pago');
  });

  it('debe manejar errores al eliminar un pago', async () => {
    const error = new Error('Error al eliminar pago');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(paymentsService.deletePayment('1')).rejects.toThrow('Error al eliminar pago');
  });
}); 