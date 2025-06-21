import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentForm } from '@/modules/contracts/components/PaymentForm';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    createPayment: vi.fn(),
    updatePayment: vi.fn(),
  },
}));

describe('PaymentForm', () => {
  const mockPayment = {
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
  };

  const mockContractId = '1';
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Monto')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Pago')).toBeInTheDocument();
    expect(screen.getByLabelText('Método de Pago')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('debe crear un nuevo pago correctamente', async () => {
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

    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: newPayment.amount.toString() },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Pago'), {
      target: { value: newPayment.paidAt },
    });
    fireEvent.change(screen.getByLabelText('Método de Pago'), {
      target: { value: newPayment.paymentMethodId },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.createPayment).toHaveBeenCalledWith(
        mockContractId,
        newPayment
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('debe actualizar un pago existente correctamente', async () => {
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

    render(
      <PaymentForm
        contractId={mockContractId}
        payment={mockPayment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: updatedPayment.amount.toString() },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Pago'), {
      target: { value: updatedPayment.paidAt },
    });
    fireEvent.change(screen.getByLabelText('Método de Pago'), {
      target: { value: updatedPayment.paymentMethodId },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.updatePayment).toHaveBeenCalledWith(
        mockContractId,
        '1',
        updatedPayment
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('debe llamar a onCancel al hacer clic en Cancelar', () => {
    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('debe validar que el monto sea positivo', async () => {
    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '-1000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El monto debe ser mayor a 0')).toBeInTheDocument();
    });
  });

  it('debe validar que la fecha de pago no sea futura', async () => {
    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    fireEvent.change(screen.getByLabelText('Fecha de Pago'), {
      target: { value: tomorrowStr },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La fecha de pago no puede ser futura')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al crear pago', async () => {
    const error = new Error('Error al crear pago');
    (contractsService.createPayment as any).mockRejectedValueOnce(error);

    render(
      <PaymentForm
        contractId={mockContractId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Pago'), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Método de Pago'), {
      target: { value: '1' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al procesar el pago')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al actualizar pago', async () => {
    const error = new Error('Error al actualizar pago');
    (contractsService.updatePayment as any).mockRejectedValueOnce(error);

    render(
      <PaymentForm
        contractId={mockContractId}
        payment={mockPayment}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '2000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al procesar el pago')).toBeInTheDocument();
    });
  });
}); 