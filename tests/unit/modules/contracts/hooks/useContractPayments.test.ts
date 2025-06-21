import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContractPayments } from '@/modules/contracts/hooks/useContractPayments';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getPayments: vi.fn(),
    createPayment: vi.fn(),
    updatePayment: vi.fn(),
    deletePayment: vi.fn(),
  },
}));

describe('useContractPayments', () => {
  const mockPayments = [
    {
      id: '1',
      amount: 1000,
      status: 'PAID',
      dueDate: '2024-01-01',
      paidAt: '2024-01-01T10:00:00Z',
      paymentMethod: {
        id: '1',
        type: 'CREDIT_CARD',
        lastFourDigits: '1234',
      },
    },
  ];

  const mockContractId = '1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar los pagos correctamente', async () => {
    (contractsService.getPayments as any).mockResolvedValueOnce({
      data: mockPayments,
    });

    const { result } = renderHook(() => useContractPayments(mockContractId));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.payments).toBe(null);

    await act(async () => {
      await result.current.loadPayments();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.payments).toEqual(mockPayments);
  });

  it('debe manejar errores al cargar los pagos', async () => {
    const error = new Error('Error al cargar pagos');
    (contractsService.getPayments as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.loadPayments();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.payments).toBe(null);
  });

  it('debe crear un pago correctamente', async () => {
    const newPayment = {
      amount: 1000,
      paidAt: '2024-01-02',
      paymentMethodId: '1',
    };

    (contractsService.createPayment as any).mockResolvedValueOnce({
      data: {
        id: '2',
        ...newPayment,
        status: 'PAID',
        paymentMethod: {
          id: '1',
          type: 'CREDIT_CARD',
          lastFourDigits: '1234',
        },
      },
    });

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.createPayment(newPayment);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.createPayment).toHaveBeenCalledWith(
      mockContractId,
      newPayment
    );
  });

  it('debe manejar errores al crear un pago', async () => {
    const error = new Error('Error al crear pago');
    (contractsService.createPayment as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.createPayment({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar un pago correctamente', async () => {
    const updatedPayment = {
      amount: 2000,
      paidAt: '2024-01-03',
      paymentMethodId: '2',
    };

    (contractsService.updatePayment as any).mockResolvedValueOnce({
      data: {
        id: '1',
        ...updatedPayment,
        status: 'PAID',
        paymentMethod: {
          id: '2',
          type: 'DEBIT_CARD',
          lastFourDigits: '5678',
        },
      },
    });

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.updatePayment('1', updatedPayment);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.updatePayment).toHaveBeenCalledWith(
      mockContractId,
      '1',
      updatedPayment
    );
  });

  it('debe manejar errores al actualizar un pago', async () => {
    const error = new Error('Error al actualizar pago');
    (contractsService.updatePayment as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.updatePayment('1', {} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un pago correctamente', async () => {
    (contractsService.deletePayment as any).mockResolvedValueOnce({});

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.deletePayment('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.deletePayment).toHaveBeenCalledWith(
      mockContractId,
      '1'
    );
  });

  it('debe manejar errores al eliminar un pago', async () => {
    const error = new Error('Error al eliminar pago');
    (contractsService.deletePayment as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      await result.current.deletePayment('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe limpiar el estado de los pagos', async () => {
    const { result } = renderHook(() => useContractPayments(mockContractId));

    await act(async () => {
      result.current.clearPayments();
    });

    expect(result.current.payments).toBe(null);
    expect(result.current.error).toBe(null);
  });
}); 