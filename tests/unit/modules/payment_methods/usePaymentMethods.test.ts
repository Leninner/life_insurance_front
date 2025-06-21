import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaymentMethods, usePaymentMethod } from '@/modules/payment_methods/usePaymentMethods';
import { paymentMethodsService } from '@/modules/payment_methods/paymentMethods.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces';

// Mock del servicio de métodos de pago
vi.mock('@/modules/payment_methods/paymentMethods.service', () => ({
  paymentMethodsService: {
    getPaymentMethods: vi.fn(),
    getPaymentMethod: vi.fn(),
    createPaymentMethod: vi.fn(),
    updatePaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
  },
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('usePaymentMethods', () => {
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    (paymentMethodsService.getPaymentMethods as any).mockResolvedValue({
      data: [mockPaymentMethod],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  });

  it('debe cargar los métodos de pago correctamente', async () => {
    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentMethods).toEqual([]);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentMethods).toEqual([mockPaymentMethod]);
  });

  it('debe manejar errores al cargar métodos de pago', async () => {
    const error = new Error('Error al cargar métodos de pago');
    (paymentMethodsService.getPaymentMethods as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.paymentMethods).toEqual([]);
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

    (paymentMethodsService.createPaymentMethod as any).mockResolvedValueOnce({
      data: { ...newPaymentMethod, id: '2' },
    });

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    await act(async () => {
      await result.current.createPaymentMethod(newPaymentMethod);
    });

    expect(result.current.isCreating).toBe(false);
    expect(paymentMethodsService.createPaymentMethod).toHaveBeenCalledWith(newPaymentMethod);
  });

  it('debe manejar errores al crear un método de pago', async () => {
    const error = new Error('Error al crear método de pago');
    (paymentMethodsService.createPaymentMethod as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

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

    await act(async () => {
      await result.current.createPaymentMethod(newPaymentMethod);
    });

    expect(result.current.isCreating).toBe(false);
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

    (paymentMethodsService.updatePaymentMethod as any).mockResolvedValueOnce({
      data: { ...updatedPaymentMethod, id: '1' },
    });

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    await act(async () => {
      await result.current.updatePaymentMethod('1', updatedPaymentMethod);
    });

    expect(result.current.isUpdating).toBe(false);
    expect(paymentMethodsService.updatePaymentMethod).toHaveBeenCalledWith('1', updatedPaymentMethod);
  });

  it('debe manejar errores al actualizar un método de pago', async () => {
    const error = new Error('Error al actualizar método de pago');
    (paymentMethodsService.updatePaymentMethod as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

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

    await act(async () => {
      await result.current.updatePaymentMethod('1', updatedPaymentMethod);
    });

    expect(result.current.isUpdating).toBe(false);
  });

  it('debe eliminar un método de pago', async () => {
    (paymentMethodsService.deletePaymentMethod as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    await act(async () => {
      await result.current.deletePaymentMethod('1');
    });

    expect(result.current.isDeleting).toBe(false);
    expect(paymentMethodsService.deletePaymentMethod).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar un método de pago', async () => {
    const error = new Error('Error al eliminar método de pago');
    (paymentMethodsService.deletePaymentMethod as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePaymentMethods(), { wrapper });

    await act(async () => {
      await result.current.deletePaymentMethod('1');
    });

    expect(result.current.isDeleting).toBe(false);
  });
});

describe('usePaymentMethod', () => {
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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    (paymentMethodsService.getPaymentMethod as any).mockResolvedValue({
      data: mockPaymentMethod,
    });
  });

  it('debe cargar un método de pago específico', async () => {
    const { result } = renderHook(() => usePaymentMethod('1'), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentMethod).toBe(undefined);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.paymentMethod).toEqual(mockPaymentMethod);
  });

  it('debe manejar errores al cargar un método de pago específico', async () => {
    const error = new Error('Error al cargar método de pago');
    (paymentMethodsService.getPaymentMethod as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => usePaymentMethod('1'), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.paymentMethod).toBe(undefined);
  });
}); 