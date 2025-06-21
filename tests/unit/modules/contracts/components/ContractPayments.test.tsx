import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractPayments } from '@/modules/contracts/components/ContractPayments';
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

describe('ContractPayments', () => {
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
    (contractsService.getPayments as any).mockResolvedValue({
      data: mockPayments,
    });
  });

  it('debe renderizar el componente correctamente', async () => {
    render(<ContractPayments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Pagos del Contrato')).toBeInTheDocument();
      expect(screen.getByText('Registrar Pago')).toBeInTheDocument();
    });
  });

  it('debe mostrar la lista de pagos', async () => {
    render(<ContractPayments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
      expect(screen.getByText('PAID')).toBeInTheDocument();
      expect(screen.getByText('01/01/2024')).toBeInTheDocument();
      expect(screen.getByText('Tarjeta terminada en 1234')).toBeInTheDocument();
    });
  });

  it('debe mostrar el formulario de registrar pago', async () => {
    render(<ContractPayments contractId={mockContractId} />);

    const addButton = screen.getByText('Registrar Pago');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Monto')).toBeInTheDocument();
      expect(screen.getByLabelText('Fecha de Pago')).toBeInTheDocument();
      expect(screen.getByLabelText('Método de Pago')).toBeInTheDocument();
    });
  });

  it('debe registrar un nuevo pago correctamente', async () => {
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

    render(<ContractPayments contractId={mockContractId} />);

    const addButton = screen.getByText('Registrar Pago');
    fireEvent.click(addButton);

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
      expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    });
  });

  it('debe eliminar un pago correctamente', async () => {
    (contractsService.deletePayment as any).mockResolvedValueOnce({});

    render(<ContractPayments contractId={mockContractId} />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Eliminar');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(contractsService.deletePayment).toHaveBeenCalledWith(
        mockContractId,
        '1'
      );
      expect(screen.queryByText('$1,000.00')).not.toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay pagos', async () => {
    (contractsService.getPayments as any).mockResolvedValueOnce({
      data: [],
    });

    render(<ContractPayments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('No hay pagos registrados')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar pagos', async () => {
    const error = new Error('Error al cargar pagos');
    (contractsService.getPayments as any).mockRejectedValueOnce(error);

    render(<ContractPayments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los pagos')).toBeInTheDocument();
    });
  });

  it('debe validar que el monto sea positivo', async () => {
    render(<ContractPayments contractId={mockContractId} />);

    const addButton = screen.getByText('Registrar Pago');
    fireEvent.click(addButton);

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
    render(<ContractPayments contractId={mockContractId} />);

    const addButton = screen.getByText('Registrar Pago');
    fireEvent.click(addButton);

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
}); 