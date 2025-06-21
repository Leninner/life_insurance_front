import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoverageBenefitSelector } from '@/modules/insurances/components/CoverageBenefitSelector';

describe('CoverageBenefitSelector', () => {
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

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el selector correctamente', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Seleccionar Cobertura y Beneficio')).toBeInTheDocument();
  });

  it('debe mostrar las coberturas disponibles', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Cobertura Básica')).toBeInTheDocument();
    expect(screen.getByText('Cobertura Premium')).toBeInTheDocument();
  });

  it('debe mostrar los beneficios disponibles', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Beneficio Básico')).toBeInTheDocument();
    expect(screen.getByText('Beneficio Premium')).toBeInTheDocument();
  });

  it('debe permitir seleccionar una cobertura', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    const coverageSelect = screen.getByLabelText('Cobertura');
    fireEvent.change(coverageSelect, { target: { value: '1' } });

    expect(coverageSelect).toHaveValue('1');
  });

  it('debe permitir seleccionar un beneficio', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    const benefitSelect = screen.getByLabelText('Beneficio');
    fireEvent.change(benefitSelect, { target: { value: '1' } });

    expect(benefitSelect).toHaveValue('1');
  });

  it('debe llamar a onSelect cuando se seleccionan ambos', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    const coverageSelect = screen.getByLabelText('Cobertura');
    const benefitSelect = screen.getByLabelText('Beneficio');

    fireEvent.change(coverageSelect, { target: { value: '1' } });
    fireEvent.change(benefitSelect, { target: { value: '1' } });

    expect(mockOnSelect).toHaveBeenCalledWith({
      coverage: mockCoverages[0],
      benefit: mockBenefits[0],
    });
  });

  it('debe mostrar mensaje cuando no hay coberturas disponibles', () => {
    render(
      <CoverageBenefitSelector
        coverages={[]}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No hay coberturas disponibles')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay beneficios disponibles', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={[]}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No hay beneficios disponibles')).toBeInTheDocument();
  });

  it('debe mostrar el monto de cada cobertura', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('debe mostrar el monto de cada beneficio', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('debe mostrar la descripción de cada cobertura', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Cobertura básica de seguro de vida')).toBeInTheDocument();
    expect(screen.getByText('Cobertura premium de seguro de vida')).toBeInTheDocument();
  });

  it('debe mostrar la descripción de cada beneficio', () => {
    render(
      <CoverageBenefitSelector
        coverages={mockCoverages}
        benefits={mockBenefits}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Beneficio básico de seguro de vida')).toBeInTheDocument();
    expect(screen.getByText('Beneficio premium de seguro de vida')).toBeInTheDocument();
  });
}); 