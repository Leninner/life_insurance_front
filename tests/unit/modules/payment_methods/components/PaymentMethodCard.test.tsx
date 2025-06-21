import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentMethodCard } from '@/modules/payment_methods/components/PaymentMethodCard';
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces';
import { PaymentMethodStore } from '@/modules/payment_methods/stores/PaymentMethodStore';

vi.mock('@/modules/payment_methods/stores/PaymentMethodStore', () => ({
  PaymentMethodStore: {
    selectPaymentMethod: vi.fn(),
    deletePaymentMethod: vi.fn(),
    setDefaultPaymentMethod: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
  },
}));

describe('PaymentMethodCard', () => {
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

  it('debe renderizar la tarjeta correctamente', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText(/tarjeta de crédito/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/•••• 1111/i)).toBeInTheDocument();
    expect(screen.getByText(/12\/25/i)).toBeInTheDocument();
    expect(screen.getByText(/predeterminado/i)).toBeInTheDocument();
  });

  it('debe seleccionar la tarjeta al hacer clic', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const card = screen.getByText(/john doe/i).closest('div');
    fireEvent.click(card!);

    expect(PaymentMethodStore.selectPaymentMethod).toHaveBeenCalledWith(mockPaymentMethod);
  });

  it('debe eliminar la tarjeta al confirmar', async () => {
    window.confirm = vi.fn(() => true);

    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(PaymentMethodStore.deletePaymentMethod).toHaveBeenCalledWith('1');
    });
  });

  it('debe cancelar la eliminación de la tarjeta', async () => {
    window.confirm = vi.fn(() => false);

    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(PaymentMethodStore.deletePaymentMethod).not.toHaveBeenCalled();
    });
  });

  it('debe actualizar el método de pago predeterminado', async () => {
    const nonDefaultPaymentMethod = {
      ...mockPaymentMethod,
      isDefault: false,
    };

    render(<PaymentMethodCard paymentMethod={nonDefaultPaymentMethod} />);

    const defaultButton = screen.getByRole('button', { name: /predeterminado/i });
    fireEvent.click(defaultButton);

    await waitFor(() => {
      expect(PaymentMethodStore.setDefaultPaymentMethod).toHaveBeenCalledWith('1');
    });
  });

  it('debe manejar errores al eliminar la tarjeta', async () => {
    window.confirm = vi.fn(() => true);
    const error = new Error('Error al eliminar el método de pago');
    (PaymentMethodStore.deletePaymentMethod as jest.Mock).mockRejectedValueOnce(error);

    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(PaymentMethodStore.setError).toHaveBeenCalledWith('Error al eliminar el método de pago');
    });
  });

  it('debe mostrar la tarjeta como seleccionada', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} isSelected={true} />);

    const card = screen.getByText(/john doe/i).closest('div');
    expect(card).toHaveClass('selected');
  });

  it('debe mostrar la tarjeta como predeterminada', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const card = screen.getByText(/john doe/i).closest('div');
    expect(card).toHaveClass('default');
  });

  it('debe mostrar la tarjeta como inválida', () => {
    const invalidPaymentMethod = {
      ...mockPaymentMethod,
      isValid: false,
    };

    render(<PaymentMethodCard paymentMethod={invalidPaymentMethod} />);

    const card = screen.getByText(/john doe/i).closest('div');
    expect(card).toHaveClass('invalid');
  });

  it('debe mostrar el tipo de tarjeta correcto', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText(/tarjeta de crédito/i)).toBeInTheDocument();
  });

  it('debe mostrar el número de tarjeta enmascarado', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText(/•••• 1111/i)).toBeInTheDocument();
  });

  it('debe mostrar la fecha de expiración formateada', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    expect(screen.getByText(/12\/25/i)).toBeInTheDocument();
  });

  it('debe mostrar el nombre del titular en mayúsculas', () => {
    const paymentMethodWithLowercaseName = {
      ...mockPaymentMethod,
      details: {
        ...mockPaymentMethod.details,
        cardHolderName: 'john doe',
      },
    };

    render(<PaymentMethodCard paymentMethod={paymentMethodWithLowercaseName} />);

    expect(screen.getByText(/JOHN DOE/i)).toBeInTheDocument();
  });

  it('debe mostrar el icono de tarjeta correcto', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const cardIcon = screen.getByText(/tarjeta de crédito/i).closest('div')?.querySelector('svg');
    expect(cardIcon).toBeInTheDocument();
    expect(cardIcon).toHaveClass('h-5', 'w-5');
  });

  it('debe mostrar el botón de eliminar', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('debe mostrar el botón de predeterminado cuando no es predeterminado', () => {
    const nonDefaultPaymentMethod = {
      ...mockPaymentMethod,
      isDefault: false,
    };

    render(<PaymentMethodCard paymentMethod={nonDefaultPaymentMethod} />);

    const defaultButton = screen.getByRole('button', { name: /predeterminado/i });
    expect(defaultButton).toBeInTheDocument();
  });

  it('no debe mostrar el botón de predeterminado cuando ya es predeterminado', () => {
    render(<PaymentMethodCard paymentMethod={mockPaymentMethod} />);

    const defaultButton = screen.queryByRole('button', { name: /predeterminado/i });
    expect(defaultButton).not.toBeInTheDocument();
  });
}); 