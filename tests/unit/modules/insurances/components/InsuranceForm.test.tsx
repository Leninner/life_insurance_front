import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceForm } from '@/modules/insurances/components/InsuranceForm';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
  },
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('InsuranceForm', () => {
  const mockInsurance = {
    id: '1',
    name: 'Seguro de Vida',
    type: 'LIFE',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premium: 1000,
    coverage: 100000,
    client: {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(<InsuranceForm />);

    expect(screen.getByLabelText('Nombre del Seguro')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de Seguro')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Inicio')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Fin')).toBeInTheDocument();
    expect(screen.getByLabelText('Prima')).toBeInTheDocument();
    expect(screen.getByLabelText('Cobertura')).toBeInTheDocument();
  });

  it('debe validar campos requeridos', async () => {
    render(<InsuranceForm />);

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El tipo es requerido')).toBeInTheDocument();
      expect(screen.getByText('La fecha de inicio es requerida')).toBeInTheDocument();
    });
  });

  it('debe crear un nuevo seguro correctamente', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    (insurancesService.createInsurance as any).mockResolvedValueOnce({
      data: mockInsurance,
    });

    render(<InsuranceForm />);

    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Seguro'), {
      target: { value: 'Seguro de Vida' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Seguro'), {
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
      expect(insurancesService.createInsurance).toHaveBeenCalledWith({
        name: 'Seguro de Vida',
        type: 'LIFE',
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        premium: 1000,
        coverage: 100000,
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/insurances');
    });
  });

  it('debe actualizar un seguro existente', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    (insurancesService.updateInsurance as any).mockResolvedValueOnce({
      data: mockInsurance,
    });

    render(<InsuranceForm insurance={mockInsurance} />);

    // Modificar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Seguro'), {
      target: { value: 'Seguro Actualizado' },
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Actualizar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(insurancesService.updateInsurance).toHaveBeenCalledWith('1', {
        ...mockInsurance,
        name: 'Seguro Actualizado',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/insurances');
    });
  });

  it('debe manejar errores de validación', async () => {
    render(<InsuranceForm />);

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
    const error = new Error('Error al guardar el seguro');
    (insurancesService.createInsurance as any).mockRejectedValueOnce(error);

    render(<InsuranceForm />);

    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Nombre del Seguro'), {
      target: { value: 'Seguro de Vida' },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Seguro'), {
      target: { value: 'LIFE' },
    });
    fireEvent.change(screen.getByLabelText('Fecha de Inicio'), {
      target: { value: '2024-01-01' },
    });

    // Enviar el formulario
    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al guardar el seguro')).toBeInTheDocument();
    });
  });

  it('debe validar que la fecha de fin sea posterior a la fecha de inicio', async () => {
    render(<InsuranceForm />);

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
    render(<InsuranceForm />);

    fireEvent.change(screen.getByLabelText('Prima'), {
      target: { value: '-1000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La prima debe ser un número positivo')).toBeInTheDocument();
    });
  });

  it('debe validar que la cobertura sea un número positivo', async () => {
    render(<InsuranceForm />);

    fireEvent.change(screen.getByLabelText('Cobertura'), {
      target: { value: '-100000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La cobertura debe ser un número positivo')).toBeInTheDocument();
    });
  });
}); 