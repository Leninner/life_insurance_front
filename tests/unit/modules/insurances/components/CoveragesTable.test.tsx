import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoveragesTable } from '@/modules/insurances/components/CoveragesTable';

describe('CoveragesTable', () => {
  const mockCoverages = [
    {
      id: '1',
      name: 'Cobertura Básica',
      description: 'Cobertura básica de seguro de vida',
      amount: 50000,
      type: 'LIFE',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Cobertura Premium',
      description: 'Cobertura premium de seguro de vida',
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

  it('debe renderizar la tabla de coberturas correctamente', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Cobertura Básica')).toBeInTheDocument();
    expect(screen.getByText('Cobertura Premium')).toBeInTheDocument();
  });

  it('debe mostrar los encabezados de la tabla', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
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

  it('debe mostrar mensaje cuando no hay coberturas', () => {
    render(
      <CoveragesTable
        coverages={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('No hay coberturas disponibles')).toBeInTheDocument();
  });

  it('debe llamar a onEdit cuando se hace clic en el botón de editar', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText('Editar cobertura');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockCoverages[0]);
  });

  it('debe llamar a onDelete cuando se hace clic en el botón de eliminar', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByLabelText('Eliminar cobertura');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith(mockCoverages[0]);
  });

  it('debe mostrar el monto formateado correctamente', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('debe mostrar el estado de la cobertura correctamente', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const statusElements = screen.getAllByText('Activo');
    expect(statusElements).toHaveLength(2);
  });

  it('debe mostrar el tipo de cobertura correctamente', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const typeElements = screen.getAllByText('Vida');
    expect(typeElements).toHaveLength(2);
  });

  it('debe mostrar la descripción de cada cobertura', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Cobertura básica de seguro de vida')).toBeInTheDocument();
    expect(screen.getByText('Cobertura premium de seguro de vida')).toBeInTheDocument();
  });

  it('debe tener botones de acción para cada cobertura', () => {
    render(
      <CoveragesTable
        coverages={mockCoverages}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButtons = screen.getAllByLabelText('Editar cobertura');
    const deleteButtons = screen.getAllByLabelText('Eliminar cobertura');

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
}); 