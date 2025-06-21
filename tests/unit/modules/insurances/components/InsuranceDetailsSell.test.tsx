import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceDetailsSell } from '@/modules/insurances/components/InsuranceDetailsSell';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurancePlans: vi.fn(),
    createInsurance: vi.fn(),
  },
}));

describe('InsuranceDetailsSell', () => {
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

  const mockClient = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '1234567890',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getInsurancePlans as any).mockResolvedValue({
      data: mockPlans,
    });
  });

  it('debe renderizar el componente correctamente', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      expect(screen.getByText('Venta de Seguro')).toBeInTheDocument();
    });
  });

  it('debe mostrar los planes disponibles', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      expect(screen.getByText('Plan Básico')).toBeInTheDocument();
      expect(screen.getByText('Plan Premium')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles del cliente', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<InsuranceDetailsSell client={mockClient} />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar planes');
    (insurancesService.getInsurancePlans as any).mockRejectedValueOnce(error);

    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los planes')).toBeInTheDocument();
    });
  });

  it('debe permitir seleccionar un plan', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    expect(screen.getByText('Plan seleccionado: Plan Básico')).toBeInTheDocument();
  });

  it('debe mostrar los detalles del plan seleccionado', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('Cobertura por fallecimiento')).toBeInTheDocument();
    expect(screen.getByText('Asistencia médica')).toBeInTheDocument();
  });

  it('debe crear un seguro cuando se confirma la venta', async () => {
    const mockCreatedInsurance = {
      id: '1',
      name: 'Seguro de Vida',
      type: 'LIFE',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 100,
      coverage: 50000,
      client: mockClient,
    };

    (insurancesService.createInsurance as any).mockResolvedValueOnce({
      data: mockCreatedInsurance,
    });

    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    const confirmButton = screen.getByText('Confirmar Venta');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(insurancesService.createInsurance).toHaveBeenCalledWith({
        planId: '1',
        clientId: '1',
        startDate: expect.any(String),
        endDate: expect.any(String),
      });
    });
  });

  it('debe manejar errores al crear el seguro', async () => {
    const error = new Error('Error al crear seguro');
    (insurancesService.createInsurance as any).mockRejectedValueOnce(error);

    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    const confirmButton = screen.getByText('Confirmar Venta');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Error al crear el seguro')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay planes disponibles', async () => {
    (insurancesService.getInsurancePlans as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsuranceDetailsSell client={mockClient} />);

    await waitFor(() => {
      expect(screen.getByText('No hay planes disponibles')).toBeInTheDocument();
    });
  });

  it('debe mostrar el botón de confirmar venta solo cuando hay un plan seleccionado', async () => {
    render(<InsuranceDetailsSell client={mockClient} />);

    expect(screen.queryByText('Confirmar Venta')).not.toBeInTheDocument();

    await waitFor(() => {
      const selectButtons = screen.getAllByText('Seleccionar');
      fireEvent.click(selectButtons[0]);
    });

    expect(screen.getByText('Confirmar Venta')).toBeInTheDocument();
  });
}); 