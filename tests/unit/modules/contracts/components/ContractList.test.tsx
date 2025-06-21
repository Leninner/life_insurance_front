import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractList } from '@/modules/contracts/components/ContractList';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getContracts: vi.fn(),
  },
}));

// Mock de next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ContractList', () => {
  const mockContracts = [
    {
      id: '1',
      name: 'Contrato de Vida',
      type: 'LIFE',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
    },
    {
      id: '2',
      name: 'Contrato de Salud',
      type: 'HEALTH',
      status: 'PENDING',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (contractsService.getContracts as any).mockResolvedValue({
      data: mockContracts,
    });
  });

  it('debe renderizar la lista de contratos correctamente', async () => {
    render(<ContractList />);

    await waitFor(() => {
      expect(screen.getByText('Contrato de Vida')).toBeInTheDocument();
      expect(screen.getByText('Contrato de Salud')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<ContractList />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar contratos');
    (contractsService.getContracts as any).mockRejectedValueOnce(error);

    render(<ContractList />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los contratos')).toBeInTheDocument();
    });
  });

  it('debe manejar la búsqueda de contratos', async () => {
    render(<ContractList />);

    const searchInput = screen.getByPlaceholderText('Buscar contratos...');
    fireEvent.change(searchInput, { target: { value: 'Vida' } });

    await waitFor(() => {
      expect(contractsService.getContracts).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Vida',
        })
      );
    });
  });

  it('debe manejar el filtrado por estado', async () => {
    render(<ContractList />);

    const statusFilter = screen.getByLabelText('Filtrar por estado');
    fireEvent.change(statusFilter, { target: { value: 'ACTIVE' } });

    await waitFor(() => {
      expect(contractsService.getContracts).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ACTIVE',
        })
      );
    });
  });

  it('debe manejar la paginación', async () => {
    render(<ContractList />);

    const nextPageButton = screen.getByLabelText('Siguiente página');
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(contractsService.getContracts).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
        })
      );
    });
  });

  it('debe mostrar mensaje cuando no hay contratos', async () => {
    (contractsService.getContracts as any).mockResolvedValueOnce({
      data: [],
    });

    render(<ContractList />);

    await waitFor(() => {
      expect(screen.getByText('No hay contratos disponibles')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles del contrato al hacer clic', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    render(<ContractList />);

    await waitFor(() => {
      const contractItem = screen.getByText('Contrato de Vida');
      fireEvent.click(contractItem);
      expect(mockRouter.push).toHaveBeenCalledWith('/contracts/1');
    });
  });

  it('debe mostrar el botón de crear contrato', () => {
    render(<ContractList />);
    expect(screen.getByText('Crear Contrato')).toBeInTheDocument();
  });

  it('debe navegar a la página de creación al hacer clic en el botón', async () => {
    const mockRouter = {
      push: vi.fn(),
    };
    vi.mocked(useRouter).mockReturnValue(mockRouter);

    render(<ContractList />);

    const createButton = screen.getByText('Crear Contrato');
    fireEvent.click(createButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/contracts/create');
  });
}); 