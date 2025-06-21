import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoverageForm } from '@/modules/insurances/components/CoverageForm';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    addCoverage: vi.fn(),
    updateCoverage: vi.fn(),
  },
}));

describe('CoverageForm', () => {
  const mockCoverage = {
    id: '1',
    name: 'Cobertura de Vida',
    amount: 50000,
    description: 'Cobertura por fallecimiento',
  };

  const mockInsuranceId = '1';
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Nombre de la Cobertura')).toBeInTheDocument();
    expect(screen.getByLabelText('Monto')).toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('debe crear una nueva cobertura correctamente', async () => {
    const newCoverage = {
      name: 'Nueva Cobertura',
      amount: 75000,
      description: 'Nueva descripción',
    };

    (insurancesService.addCoverage as any).mockResolvedValueOnce({
      data: { id: '2', ...newCoverage },
    });

    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Nombre de la Cobertura'), {
      target: { value: newCoverage.name },
    });
    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: newCoverage.amount.toString() },
    });
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: newCoverage.description },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(insurancesService.addCoverage).toHaveBeenCalledWith(
        mockInsuranceId,
        newCoverage
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('debe actualizar una cobertura existente correctamente', async () => {
    const updatedCoverage = {
      name: 'Cobertura Actualizada',
      amount: 100000,
      description: 'Descripción actualizada',
    };

    (insurancesService.updateCoverage as any).mockResolvedValueOnce({
      data: { id: '1', ...updatedCoverage },
    });

    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        coverage={mockCoverage}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Nombre de la Cobertura'), {
      target: { value: updatedCoverage.name },
    });
    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: updatedCoverage.amount.toString() },
    });
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: updatedCoverage.description },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(insurancesService.updateCoverage).toHaveBeenCalledWith(
        mockInsuranceId,
        '1',
        updatedCoverage
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('debe llamar a onCancel al hacer clic en Cancelar', () => {
    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
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
      <CoverageForm
        insuranceId={mockInsuranceId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '-50000' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El monto debe ser mayor a 0')).toBeInTheDocument();
    });
  });

  it('debe validar campos requeridos', async () => {
    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El monto es requerido')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al crear cobertura', async () => {
    const error = new Error('Error al crear cobertura');
    (insurancesService.addCoverage as any).mockRejectedValueOnce(error);

    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Nombre de la Cobertura'), {
      target: { value: 'Nueva Cobertura' },
    });
    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '50000' },
    });
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Descripción' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al procesar la cobertura')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al actualizar cobertura', async () => {
    const error = new Error('Error al actualizar cobertura');
    (insurancesService.updateCoverage as any).mockRejectedValueOnce(error);

    render(
      <CoverageForm
        insuranceId={mockInsuranceId}
        coverage={mockCoverage}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Nombre de la Cobertura'), {
      target: { value: 'Cobertura Actualizada' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al procesar la cobertura')).toBeInTheDocument();
    });
  });
}); 