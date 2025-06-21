import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractForm } from '@/modules/contracts/components/ContractForm';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    createContract: vi.fn(),
    updateContract: vi.fn(),
  },
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ContractForm', () => {
  const mockContract = {
    id: '1',
    name: 'Contrato de Vida',
    type: 'LIFE',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premium: 1000,
    coverage: 100000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(<ContractForm />);

    expect(screen.getByLabelText('Nombre del Contrato')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de Contrato')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Fin')).toBeInTheDocument();
    expect(screen.getByLabelText('Prima')).toBeInTheDocument();
    expect(screen.getByLabelText('Cobertura')).toBeInTheDocument();
  });

  it('debe validar campos requeridos', async () => {
    render(<ContractForm />);

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El tipo es requerido')).toBeInTheDocument();
      expect(screen.getByText('La fecha de inicio es requerida')).toBeInTheDocument();
    });
  });

  it('debe crear un nuevo contrato correctamente', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    (contractsService.createContract as any).mockResolvedValueOnce({
      data: mockContract,
    });

    render(<ContractForm />);

    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Contrato'), {
      target: { value: 'Contrato de Vida' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Contrato'), {
      target: { value: 'LIFE' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Inicio'), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Fin'), {
      target: { value: '2025-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Prima'), {
      target: { value: '1000' },
    });
    fireEvent.change(screen.getByLabelText('Cobertura'), {
      target: { value: '100000' },
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.createContract).toHaveBeenCalledWith({
        name: 'Contrato de Vida',
        type: 'LIFE',
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        premium: 1000,
        coverage: 100000,
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/contracts');
    });
  });

  it('debe actualizar un contrato existente', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    (contractsService.updateContract as any).mockResolvedValueOnce({
      data: mockContract,
    });

    render(<ContractForm contract={mockContract} />);

    // Modificar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Contrato'), {
      target: { value: 'Contrato Actualizado' },
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Actualizar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.updateContract).toHaveBeenCalledWith('1', {
        ...mockContract,
        name: 'Contrato Actualizado',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/contracts');
    });
  });

  it('debe manejar errores de validación', async () => {
    render(<ContractForm />);

    // Intentar enviar el formulario vacío
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El tipo es requerido')).toBeInTheDocument();
      expect(screen.getByText('La fecha de inicio es requerida')).toBeInTheDocument();
    });
  });

  it('debe manejar errores del servidor', async () => {
    const error = new Error('Error al guardar el contrato');
    (contractsService.createContract as any).mockRejectedValueOnce(error);

    render(<ContractForm />);

    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Contrato'), {
      target: { value: 'Contrato de Vida' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Contrato'), {
      target: { value: 'LIFE' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Inicio'), {
      target: { value: '2024-01-01' },
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al guardar el contrato')).toBeInTheDocument();
    });
  });

  it('debe validar que la fecha de fin sea posterior a la fecha de inicio', async () => {
    render(<ContractForm />);

    // Llenar fechas inválidas
    fireEvent.change(screen.getByLabelText('Fecha de Inicio'), {
      target: { value: '2025-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Fin'), {
      target: { value: '2024-01-01' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La fecha de fin debe ser posterior a la fecha de inicio')).toBeInTheDocument();
    });
  });

  it('debe validar que la prima sea un número positivo', async () => {
    render(<ContractForm />);

    fireEvent.change(screen.getByLabelText('Prima'), {
      target: { value: '-1000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La prima debe ser un número positivo')).toBeInTheDocument();
    });
  });
}); 