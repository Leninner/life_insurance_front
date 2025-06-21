import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BenefitsTable } from '@/modules/insurances/components/BenefitsTable';

describe('BenefitsTable', () => {
  const mockBenefits = [
    {
      id: '1',
      name: 'Beneficio Básico',
      description: 'Beneficio básico de seguro de vida',
      amount: 50000,
      type: 'LIFE',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Beneficio Premium',
      description: 'Beneficio premium de seguro de vida',
      amount: 100000,
      type: 'LIFE',
      status: 'ACTIVE',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la tabla de beneficios correctamente', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Beneficio Básico')).toBeInTheDocument();
    expect(screen.getByText('Beneficio Premium')).toBeInTheDocument();
  });

  it('debe mostrar los encabezados de la tabla', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Monto')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Acciones')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay beneficios', () => {
    render(
      <BenefitsTable
        benefits={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No hay beneficios disponibles')).toBeInTheDocument();
  });

  it('debe llamar a onEdit cuando se hace clic en el botón de editar', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText('Editar beneficio');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBenefits[0]);
  });

  it('debe llamar a onDelete cuando se hace clic en el botón de eliminar', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Eliminar beneficio');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBenefits[0]);
  });

  it('debe mostrar el monto formateado correctamente', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('debe mostrar el estado del beneficio correctamente', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const statusElements = screen.getAllByText('Activo');
    expect(statusElements).toHaveLength(2);
  });

  it('debe mostrar el tipo de beneficio correctamente', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const typeElements = screen.getAllByText('Vida');
    expect(typeElements).toHaveLength(2);
  });

  it('debe mostrar la descripción de cada beneficio', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Beneficio básico de seguro de vida')).toBeInTheDocument();
    expect(screen.getByText('Beneficio premium de seguro de vida')).toBeInTheDocument();
  });

  it('debe tener botones de acción para cada beneficio', () => {
    render(
      <BenefitsTable
        benefits={mockBenefits}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText('Editar beneficio');
    const deleteButtons = screen.getAllByLabelText('Eliminar beneficio');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
}); 