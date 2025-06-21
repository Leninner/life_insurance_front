import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentMethodList } from '@/modules/payment_methods/components/PaymentMethodList';
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces';
import { PaymentMethodStore } from '@/modules/payment_methods/stores/PaymentMethodStore';

vi.mock('@/modules/payment_methods/stores/PaymentMethodStore', () => ({
  PaymentMethodStore: {
    selectPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
    setDefaultPaymentMethod: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    isLoading: false,
    error: null,
  },
}));

describe('PaymentMethodList', () => {
  const mockPaymentMethods = [
    {
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
    },
    {
      id: '2',
      type: PaymentMethodType.CREDIT_CARD,
      details: {
        cardNumber: '5555555555554444',
        cardHolderName: 'JANE DOE',
        cardExpirationDate: '1226',
        cardCvv: '456',
      },
      isValid: true,
      isDefault: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la lista correctamente', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText(/métodos de pago/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/predeterminado/i)).toBeInTheDocument();
  });

  it('debe seleccionar un método de pago', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const card = screen.getByText(/jane doe/i).closest('div');
    fireEvent.click(card!);

    expect(PaymentMethodStore.selectPaymentMethod).toHaveBeenCalledWith(mockPaymentMethods[1]);
  });

  it('debe eliminar un método de pago', async () => {
    window.confirm = vi.fn(() => true);

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(PaymentMethodStore.deletePaymentMethod).toHaveBeenCalledWith('2');
    });
  });

  it('debe cancelar la eliminación de un método de pago', async () => {
    window.confirm = vi.fn(() => false);

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(PaymentMethodStore.deletePaymentMethod).not.toHaveBeenCalled();
    });
  });

  it('debe actualizar el método de pago predeterminado', async () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const defaultButtons = screen.getAllByRole('button', { name: /predeterminado/i });
    fireEvent.click(defaultButtons[1]);

    await waitFor(() => {
      expect(PaymentMethodStore.setDefaultPaymentMethod).toHaveBeenCalledWith('2');
    });
  });

  it('debe manejar errores al eliminar un método de pago', async () => {
    window.confirm = vi.fn(() => true);
    const error = new Error('Error al eliminar el método de pago');
    (PaymentMethodStore.deletePaymentMethod as jest.Mock).mockRejectedValueOnce(error);

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[1]);

    await waitFor(() => {
      expect(PaymentMethodStore.setError).toHaveBeenCalledWith('Error al eliminar el método de pago');
    });
  });

  it('debe manejar errores al actualizar el método de pago predeterminado', async () => {
    const error = new Error('Error al actualizar el método de pago predeterminado');
    (PaymentMethodStore.setDefaultPaymentMethod as jest.Mock).mockRejectedValueOnce(error);

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const defaultButtons = screen.getAllByRole('button', { name: /predeterminado/i });
    fireEvent.click(defaultButtons[1]);

    await waitFor(() => {
      expect(PaymentMethodStore.setError).toHaveBeenCalledWith('Error al actualizar el método de pago predeterminado');
    });
  });

  it('debe mostrar el estado de carga', () => {
    PaymentMethodStore.isLoading = true;

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('debe mostrar el error del servidor', () => {
    PaymentMethodStore.error = 'Error al cargar los métodos de pago';

    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText(/error al cargar los métodos de pago/i)).toBeInTheDocument();
  });

  it('debe mostrar un mensaje cuando no hay métodos de pago', () => {
    render(<PaymentMethodList paymentMethods={[]} />);

    expect(screen.getByText(/no hay métodos de pago/i)).toBeInTheDocument();
  });

  it('debe mostrar el método de pago seleccionado', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} selectedPaymentMethod={mockPaymentMethods[1]} />);

    const selectedCard = screen.getByText(/jane doe/i).closest('div');
    expect(selectedCard).toHaveClass('selected');
  });

  it('debe mostrar el método de pago predeterminado', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const defaultCard = screen.getByText(/john doe/i).closest('div');
    expect(defaultCard).toHaveClass('default');
  });

  it('debe mostrar el método de pago inválido', () => {
    const invalidPaymentMethods = [
      {
        ...mockPaymentMethods[0],
        isValid: false,
      },
    ];

    render(<PaymentMethodList paymentMethods={invalidPaymentMethods} />);

    const invalidCard = screen.getByText(/john doe/i).closest('div');
    expect(invalidCard).toHaveClass('invalid');
  });

  it('debe mostrar el tipo de tarjeta correcto', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getAllByText(/tarjeta de crédito/i)).toHaveLength(2);
  });

  it('debe mostrar el número de tarjeta enmascarado', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText(/•••• 1111/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• 4444/i)).toBeInTheDocument();
  });

  it('debe mostrar la fecha de expiración formateada', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    expect(screen.getByText(/12\/25/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/26/i)).toBeInTheDocument();
  });

  it('debe mostrar el nombre del titular en mayúsculas', () => {
    const paymentMethodsWithLowercaseNames = [
      {
        ...mockPaymentMethods[0],
        details: {
          ...mockPaymentMethods[0].details,
          cardHolderName: 'john doe',
        },
      },
    ];

    render(<PaymentMethodList paymentMethods={paymentMethodsWithLowercaseNames} />);

    expect(screen.getByText(/JOHN DOE/i)).toBeInTheDocument();
  });

  it('debe mostrar el icono de tarjeta correcto', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const cardIcons = screen.getAllByText(/tarjeta de crédito/i).map((element) => element.closest('div')?.querySelector('svg'));
    cardIcons.forEach((icon) => {
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-5', 'w-5');
    });
  });

  it('debe mostrar el botón de eliminar para cada método de pago', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    expect(deleteButtons).toHaveLength(2);
  });

  it('debe mostrar el botón de predeterminado solo para métodos no predeterminados', () => {
    render(<PaymentMethodList paymentMethods={mockPaymentMethods} />);

    const defaultButtons = screen.getAllByRole('button', { name: /predeterminado/i });
    expect(defaultButtons).toHaveLength(1);
  });
}); 