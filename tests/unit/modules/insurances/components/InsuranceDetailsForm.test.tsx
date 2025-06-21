import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceDetailsForm } from '@/modules/insurances/components/InsuranceDetailsForm';

describe('InsuranceDetailsForm', () => {
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
      phone: '1234567890',
    },
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Detalles del Seguro')).toBeInTheDocument();
  });

  it('debe mostrar los detalles del seguro', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Inicio')).toBeInTheDocument();
    expect(screen.getByText('Fecha de Fin')).toBeInTheDocument();
    expect(screen.getByText('Prima')).toBeInTheDocument();
    expect(screen.getByText('Cobertura')).toBeInTheDocument();
  });

  it('debe mostrar los detalles del cliente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cliente')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('debe mostrar el tipo de seguro correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Vida')).toBeInTheDocument();
  });

  it('debe mostrar el estado del seguro correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('debe mostrar las fechas formateadas correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('01/01/2025')).toBeInTheDocument();
  });

  it('debe mostrar el monto de la prima formateado correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('$1,000')).toBeInTheDocument();
  });

  it('debe mostrar el monto de la cobertura formateado correctamente', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('debe mostrar el botón de editar', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('debe llamar a onSubmit cuando se hace clic en el botón de editar', () => {
    render(
      <InsuranceDetailsForm
        insurance={mockInsurance}
        onSubmit={mockOnSubmit}
      />
    );

    const editButton = screen.getByText('Editar');
    fireEvent.click(editButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(mockInsurance);
  });

  it('debe mostrar mensaje cuando no hay seguro', () => {
    render(
      <InsuranceDetailsForm
        insurance={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('No hay seguro seleccionado')).toBeInTheDocument();
  });
}); 