import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePayments } from '@/modules/payments/usePayments';
import { paymentsService } from '@/modules/payments/payments.service';
import { PaymentStatus } from '@/modules/payments/payments.interface';

vi.mock('@/modules/payments/payments.service', () => ({
  paymentsService: {
    getPayments: vi.fn(),
    getPayment: vi.fn(),
    createPayment: vi.fn(),
    updatePayment: vi.fn(),
    deletePayment: vi.fn(),
  },
}));

describe('usePayments', () => {
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

  it('debe cargar los pagos correctamente', async () => {
    (paymentsService.getPayments as any).mockResolvedValueOnce({
      data: [mockPayment],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.loadPayments();
    });

    expect(result.current.payments).toEqual([mockPayment]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar los pagos', async () => {
    const error = new Error('Error al cargar los pagos');
    (paymentsService.getPayments as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.loadPayments();
    });

    expect(result.current.payments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al cargar los pagos');
  });

  it('debe crear un pago correctamente', async () => {
    const newPayment = {
      details: {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      },
    };

    (paymentsService.createPayment as any).mockResolvedValueOnce({
      ...newPayment,
      id: '2',
      status: PaymentStatus.PENDING,
    });

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.createPayment(newPayment);
    });

    expect(result.current.payments).toContainEqual({
      ...newPayment,
      id: '2',
      status: PaymentStatus.PENDING,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al crear un pago', async () => {
    const error = new Error('Error al crear el pago');
    (paymentsService.createPayment as any).mockRejectedValueOnce(error);

    const newPayment = {
      details: {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      },
    };

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.createPayment(newPayment);
    });

    expect(result.current.payments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al crear el pago');
  });

  it('debe actualizar un pago correctamente', async () => {
    const updatedPayment = {
      status: PaymentStatus.COMPLETED,
    };

    (paymentsService.updatePayment as any).mockResolvedValueOnce({
      ...mockPayment,
      ...updatedPayment,
    });

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.updatePayment('1', updatedPayment);
    });

    expect(result.current.payments).toContainEqual({
      ...mockPayment,
      ...updatedPayment,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al actualizar un pago', async () => {
    const error = new Error('Error al actualizar el pago');
    (paymentsService.updatePayment as any).mockRejectedValueOnce(error);

    const updatedPayment = {
      status: PaymentStatus.COMPLETED,
    };

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.updatePayment('1', updatedPayment);
    });

    expect(result.current.payments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al actualizar el pago');
  });

  it('debe eliminar un pago correctamente', async () => {
    (paymentsService.deletePayment as any).mockResolvedValueOnce(true);

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.deletePayment('1');
    });

    expect(result.current.payments).not.toContainEqual(mockPayment);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al eliminar un pago', async () => {
    const error = new Error('Error al eliminar el pago');
    (paymentsService.deletePayment as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePayments());

    await act(async () => {
      await result.current.deletePayment('1');
    });

    expect(result.current.payments).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al eliminar el pago');
  });

  it('debe limpiar el error', () => {
    const { result } = renderHook(() => usePayments());

    act(() => {
      result.current.setError('Error de prueba');
    });

    expect(result.current.error).toBe('Error de prueba');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('debe establecer el estado de carga', () => {
    const { result } = renderHook(() => usePayments());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });
}); 