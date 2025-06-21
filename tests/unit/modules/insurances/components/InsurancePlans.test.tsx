import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsurancePlans } from '@/modules/insurances/components/InsurancePlans';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurancePlans: vi.fn(),
  },
}));

describe('InsurancePlans', () => {
  const mockPlans = [
    {
      id: '1',
      name: 'Plan Básico',
      description: 'Plan básico de seguro de vida',
      coverage: 50000,
      premium: 100,
      features: ['Cobertura por fallecimiento', 'Asistencia médica'],
    },
    {
      id: '2',
      name: 'Plan Premium',
      description: 'Plan premium de seguro de vida',
      coverage: 100000,
      premium: 200,
      features: ['Cobertura por fallecimiento', 'Asistencia médica', 'Indemnización por invalidez'],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getInsurancePlans as any).mockResolvedValue({
      data: mockPlans,
    });
  });

  it('debe renderizar la lista de planes correctamente', async () => {
    render(<InsurancePlans />);

    await waitFor(() => {
      expect(screen.getByText('Plan Básico')).toBeInTheDocument();
      expect(screen.getByText('Plan Premium')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<InsurancePlans />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar planes');
    (insurancesService.getInsurancePlans as any).mockRejectedValueOnce(error);

    render(<InsurancePlans />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los planes')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles de cada plan', async () => {
    render(<InsurancePlans />);

    await waitFor(() => {
      expect(screen.getByText('Plan Básico')).toBeInTheDocument();
      expect(screen.getByText('Plan básico de seguro de vida')).toBeInTheDocument();
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('Cobertura por fallecimiento')).toBeInTheDocument();
      expect(screen.getByText('Asistencia médica')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay planes disponibles', async () => {
    (insurancesService.getInsurancePlans as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsurancePlans />);

    await waitFor(() => {
      expect(screen.getByText('No hay planes disponibles')).toBeInTheDocument();
    });
  });

  it('debe permitir seleccionar un plan', async () => {
    const onSelect = vi.fn();
    render(<InsurancePlans onSelect={onSelect} />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    expect(onSelect).toHaveBeenCalledWith(mockPlans[0]);
  });

  it('debe mostrar el botón de selección en cada plan', async () => {
    render(<InsurancePlans />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      expect(selectButtons).toHaveLength(2);
    });
  });

  it('debe mostrar el precio y cobertura formateados correctamente', async () => {
    render(<InsurancePlans />);

    await waitFor(() => {
      expect(screen.getByText('$50,000')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$100,000')).toBeInTheDocument();
      expect(screen.getByText('$200')).toBeInTheDocument();
    });
  });

  it('debe mostrar las características de cada plan', async () => {
    render(<InsurancePlans />);

    await waitFor(() => {
      const features = screen.getAllByText(/Cobertura por fallecimiento|Asistencia médica|Indemnización por invalidez/);
      expect(features).toHaveLength(5); // 2 planes con características
    });
  });
}); 