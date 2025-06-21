import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentsTable } from '@/modules/payments/components/PaymentsTable';
import { PaymentStatus } from '@/modules/payments/payments.interface';

describe('PaymentsTable', () => {
  const mockPayments = [
    {
      id: '1',
      status: PaymentStatus.PENDING,
      details: {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      status: PaymentStatus.COMPLETED,
      details: {
        amount: 2000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '2',
      },
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la tabla correctamente', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/pagos/i)).toBeInTheDocument();
    expect(screen.getByText(/monto/i)).toBeInTheDocument();
    expect(screen.getByText(/descripción/i)).toBeInTheDocument();
    expect(screen.getByText(/estado/i)).toBeInTheDocument();
    expect(screen.getByText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByText(/acciones/i)).toBeInTheDocument();
  });

  it('debe mostrar los pagos en la tabla', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
    expect(screen.getByText('Pago de seguro')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('debe llamar a onEdit al hacer clic en el botón de editar', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockPayments[0]);
  });

  it('debe llamar a onDelete al hacer clic en el botón de eliminar', async () => {
    window.confirm = vi.fn(() => true);

    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('debe cancelar la eliminación al rechazar la confirmación', async () => {
    window.confirm = vi.fn(() => false);

    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('debe mostrar un mensaje cuando no hay pagos', () => {
    render(<PaymentsTable payments={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/no hay pagos/i)).toBeInTheDocument();
  });

  it('debe mostrar el estado de carga', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} isLoading={true} />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('debe mostrar el error', () => {
    const error = 'Error al cargar los pagos';
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('debe formatear correctamente el monto', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('$1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$2,000.00')).toBeInTheDocument();
  });

  it('debe formatear correctamente la fecha', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('02/01/2024')).toBeInTheDocument();
  });

  it('debe mostrar el estado correcto', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('debe mostrar los botones de acción', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('debe mostrar el icono de editar', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editIcons = screen.getAllByTestId('edit-icon');
    expect(editIcons).toHaveLength(2);
  });

  it('debe mostrar el icono de eliminar', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteIcons = screen.getAllByTestId('delete-icon');
    expect(deleteIcons).toHaveLength(2);
  });

  it('debe mostrar el icono de estado', () => {
    render(<PaymentsTable payments={mockPayments} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const statusIcons = screen.getAllByTestId('status-icon');
    expect(statusIcons).toHaveLength(2);
  });
}); 