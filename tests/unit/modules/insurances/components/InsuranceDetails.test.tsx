import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceDetails } from '@/modules/insurances/components/InsuranceDetails';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurance: vi.fn(),
    getDocuments: vi.fn(),
    getCoverages: vi.fn(),
  },
}));

describe('InsuranceDetails', () => {
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

  const mockDocuments = [
    {
      id: '1',
      name: 'Documento 1',
      type: 'PDF',
      url: 'http://example.com/doc1.pdf',
    },
  ];

  const mockCoverages = [
    {
      id: '1',
      name: 'Cobertura 1',
      amount: 50000,
      description: 'Descripción de cobertura 1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getInsurance as any).mockResolvedValue({
      data: mockInsurance,
    });
    (insurancesService.getDocuments as any).mockResolvedValue({
      data: mockDocuments,
    });
    (insurancesService.getCoverages as any).mockResolvedValue({
      data: mockCoverages,
    });
  });

  it('debe renderizar los detalles del seguro correctamente', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Seguro de Vida')).toBeInTheDocument();
      expect(screen.getByText('LIFE')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<InsuranceDetails insuranceId="1" />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar el seguro');
    (insurancesService.getInsurance as any).mockRejectedValueOnce(error);

    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los detalles del seguro')).toBeInTheDocument();
    });
  });

  it('debe mostrar los documentos del seguro', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Documento 1')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });
  });

  it('debe mostrar las coberturas del seguro', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Cobertura 1')).toBeInTheDocument();
      expect(screen.getByText('$50,000.00')).toBeInTheDocument();
      expect(screen.getByText('Descripción de cobertura 1')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay documentos', async () => {
    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No hay documentos adjuntos')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay coberturas', async () => {
    (insurancesService.getCoverages as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No hay coberturas registradas')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles del cliente', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles de la póliza', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Detalles de la Póliza')).toBeInTheDocument();
      expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // Prima
      expect(screen.getByText('$100,000.00')).toBeInTheDocument(); // Cobertura
    });
  });

  it('debe mostrar las fechas del seguro', async () => {
    render(<InsuranceDetails insuranceId="1" />);

    await waitFor(() => {
      expect(screen.getByText('01/01/2024')).toBeInTheDocument(); // Fecha de inicio
      expect(screen.getByText('01/01/2025')).toBeInTheDocument(); // Fecha de fin
    });
  });
}); 