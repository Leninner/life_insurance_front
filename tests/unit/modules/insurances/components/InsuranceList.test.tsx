import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceList } from '@/modules/insurances/components/InsuranceList';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurances: vi.fn(),
  },
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('InsuranceList', () => {
  const mockInsurances = [
    {
      id: '1',
      name: 'Seguro de Vida',
      type: 'LIFE',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 1000,
      coverage: 100000,
    },
    {
      id: '2',
      name: 'Seguro de Salud',
      type: 'HEALTH',
      status: 'PENDING',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      premium: 800,
      coverage: 50000,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getInsurances as any).mockResolvedValue({
      data: mockInsurances,
    });
  });

  it('debe renderizar la lista de seguros correctamente', async () => {
    render(<InsuranceList />);

    await waitFor(() => {
      expect(screen.getByText('Seguro de Vida')).toBeInTheDocument();
      expect(screen.getByText('Seguro de Salud')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<InsuranceList />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar seguros');
    (insurancesService.getInsurances as any).mockRejectedValueOnce(error);

    render(<InsuranceList />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los seguros')).toBeInTheDocument();
    });
  });

  it('debe manejar la búsqueda de seguros', async () => {
    render(<InsuranceList />);

    const searchInput = screen.getByPlaceholderText('Buscar seguros...');
    fireEvent.change(searchInput, { target: { value: 'Vida' } });

    await waitFor(() => {
      expect(insurancesService.getInsurances).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Vida',
        })
      );
    });
  });

  it('debe manejar el filtrado por tipo', async () => {
    render(<InsuranceList />);

    const typeFilter = screen.getByLabelText('Filtrar por tipo');
    fireEvent.change(typeFilter, { target: { value: 'LIFE' } });

    await waitFor(() => {
      expect(insurancesService.getInsurances).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'LIFE',
        })
      );
    });
  });

  it('debe manejar el filtrado por estado', async () => {
    render(<InsuranceList />);

    const statusFilter = screen.getByLabelText('Filtrar por estado');
    fireEvent.change(statusFilter, { target: { value: 'ACTIVE' } });

    await waitFor(() => {
      expect(insurancesService.getInsurances).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ACTIVE',
        })
      );
    });
  });

  it('debe manejar la paginación', async () => {
    render(<InsuranceList />);

    const nextPageButton = screen.getByLabelText('Siguiente página');
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(insurancesService.getInsurances).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      );
    });
  });

  it('debe mostrar mensaje cuando no hay seguros', async () => {
    (insurancesService.getInsurances as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsuranceList />);

    await waitFor(() => {
      expect(screen.getByText('No hay seguros disponibles')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles del seguro al hacer clic', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    render(<InsuranceList />);

    await waitFor(() => {
      const insuranceItem = screen.getByText('Seguro de Vida');
      fireEvent.click(insuranceItem);
      expect(mockRouter.push).toHaveBeenCalledWith('/insurances/1');
    });
  });

  it('debe mostrar el botón de crear seguro', () => {
    render(<InsuranceList />);
    expect(screen.getByText('Crear Seguro')).toBeInTheDocument();
  });

  it('debe navegar a la página de creación al hacer clic en el botón', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    render(<InsuranceList />);

    const createButton = screen.getByText('Crear Seguro');
    fireEvent.click(createButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/insurances/create');
  });
}); 