import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentMethodForm } from '@/modules/payment_methods/components/PaymentMethodForm';
import { PaymentMethodType } from '@/modules/payment_methods/payment-methods.interfaces';
import { PaymentMethodStore } from '@/modules/payment_methods/stores/PaymentMethodStore';

vi.mock('@/modules/payment_methods/stores/PaymentMethodStore', () => ({
  PaymentMethodStore: {
    createPaymentMethod: vi.fn(),
    updatePaymentMethod: vi.fn(),
    setError: vi.fn(),
    clearError: vi.fn(),
    isLoading: false,
    error: null,
  },
}));

describe('PaymentMethodForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();
  const mockDefaultValues = {
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

  it('debe renderizar el formulario correctamente', () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/tipo de método de pago/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de tarjeta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre del titular/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fecha de expiración/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cvv/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/método predeterminado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('debe validar campos requeridos', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el tipo de método de pago es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el número de tarjeta es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el nombre del titular es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/la fecha de expiración es requerida/i)).toBeInTheDocument();
      expect(screen.getByText(/el cvv es requerido/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato del número de tarjeta', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cardNumberInput = screen.getByLabelText(/número de tarjeta/i);
    fireEvent.change(cardNumberInput, { target: { value: '4111' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el número de tarjeta debe tener 16 dígitos/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato de la fecha de expiración', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const expirationDateInput = screen.getByLabelText(/fecha de expiración/i);
    fireEvent.change(expirationDateInput, { target: { value: '13/25' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la fecha de expiración debe ser válida/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato del nombre', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cardHolderNameInput = screen.getByLabelText(/nombre del titular/i);
    fireEvent.change(cardHolderNameInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre solo debe contener letras y espacios/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato del CVV', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cvvInput = screen.getByLabelText(/cvv/i);
    fireEvent.change(cvvInput, { target: { value: '12' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el cvv debe tener 3 o 4 dígitos/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe enviar el formulario con datos válidos', async () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const typeSelect = screen.getByLabelText(/tipo de método de pago/i);
    const cardNumberInput = screen.getByLabelText(/número de tarjeta/i);
    const cardHolderNameInput = screen.getByLabelText(/nombre del titular/i);
    const expirationDateInput = screen.getByLabelText(/fecha de expiración/i);
    const cvvInput = screen.getByLabelText(/cvv/i);
    const isDefaultCheckbox = screen.getByLabelText(/método predeterminado/i);

    fireEvent.change(typeSelect, { target: { value: PaymentMethodType.CREDIT_CARD } });
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    fireEvent.change(cardHolderNameInput, { target: { value: 'JOHN DOE' } });
    fireEvent.change(expirationDateInput, { target: { value: '1225' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });
    fireEvent.click(isDefaultCheckbox);

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        type: PaymentMethodType.CREDIT_CARD,
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '1225',
          cardCvv: '123',
        },
        isDefault: true,
      });
    });
  });

  it('debe manejar errores del servidor', async () => {
    const error = new Error('Error al guardar el método de pago');
    (PaymentMethodStore.createPaymentMethod as jest.Mock).mockRejectedValueOnce(error);

    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const typeSelect = screen.getByLabelText(/tipo de método de pago/i);
    const cardNumberInput = screen.getByLabelText(/número de tarjeta/i);
    const cardHolderNameInput = screen.getByLabelText(/nombre del titular/i);
    const expirationDateInput = screen.getByLabelText(/fecha de expiración/i);
    const cvvInput = screen.getByLabelText(/cvv/i);

    fireEvent.change(typeSelect, { target: { value: PaymentMethodType.CREDIT_CARD } });
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    fireEvent.change(cardHolderNameInput, { target: { value: 'JOHN DOE' } });
    fireEvent.change(expirationDateInput, { target: { value: '1225' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(PaymentMethodStore.setError).toHaveBeenCalledWith('Error al guardar el método de pago');
    });
  });

  it('debe limpiar el formulario al cancelar', () => {
    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const typeSelect = screen.getByLabelText(/tipo de método de pago/i);
    const cardNumberInput = screen.getByLabelText(/número de tarjeta/i);
    const cardHolderNameInput = screen.getByLabelText(/nombre del titular/i);
    const expirationDateInput = screen.getByLabelText(/fecha de expiración/i);
    const cvvInput = screen.getByLabelText(/cvv/i);

    fireEvent.change(typeSelect, { target: { value: PaymentMethodType.CREDIT_CARD } });
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    fireEvent.change(cardHolderNameInput, { target: { value: 'JOHN DOE' } });
    fireEvent.change(expirationDateInput, { target: { value: '1225' } });
    fireEvent.change(cvvInput, { target: { value: '123' } });

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
    expect(typeSelect).toHaveValue('');
    expect(cardNumberInput).toHaveValue('');
    expect(cardHolderNameInput).toHaveValue('');
    expect(expirationDateInput).toHaveValue('');
    expect(cvvInput).toHaveValue('');
  });

  it('debe mostrar el estado de carga', () => {
    PaymentMethodStore.isLoading = true;

    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
    expect(screen.getByText(/guardando/i)).toBeInTheDocument();
  });

  it('debe mostrar el error del servidor', () => {
    PaymentMethodStore.error = 'Error al guardar el método de pago';

    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText(/error al guardar el método de pago/i)).toBeInTheDocument();
  });

  it('debe limpiar el error al cambiar los campos', () => {
    PaymentMethodStore.error = 'Error al guardar el método de pago';

    render(<PaymentMethodForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const typeSelect = screen.getByLabelText(/tipo de método de pago/i);
    fireEvent.change(typeSelect, { target: { value: PaymentMethodType.CREDIT_CARD } });

    expect(PaymentMethodStore.clearError).toHaveBeenCalled();
  });
}); 