import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractDetails } from '@/modules/contracts/components/ContractDetails';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getContract: vi.fn(),
    getAttachments: vi.fn(),
    getBeneficiaries: vi.fn(),
    getSignature: vi.fn(),
  },
}));

describe('ContractDetails', () => {
  const mockContract = {
    id: '1',
    name: 'Contrato de Vida',
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

  const mockAttachments = [
    {
      id: '1',
      name: 'Documento 1',
      type: 'PDF',
      url: 'http://example.com/doc1.pdf',
    },
  ];

  const mockBeneficiaries = [
    {
      id: '1',
      name: 'María Pérez',
      relationship: 'HIJO',
      percentage: 100,
    },
  ];

  const mockSignature = {
    id: '1',
    signedAt: '2024-01-01T10:00:00Z',
    status: 'SIGNED',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (contractsService.getContract as any).mockResolvedValue({
      data: mockContract,
    });
    (contractsService.getAttachments as any).mockResolvedValue({
      data: mockAttachments,
    });
    (contractsService.getBeneficiaries as any).mockResolvedValue({
      data: mockBeneficiaries,
    });
    (contractsService.getSignature as any).mockResolvedValue({
      data: mockSignature,
    });
  });

  it('debe renderizar los detalles del contrato correctamente', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Contrato de Vida')).toBeInTheDocument();
      expect(screen.getByText('LIFE')).toBeInTheDocument();
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<ContractDetails contractId="1" />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar el contrato');
    (contractsService.getContract as any).mockRejectedValueOnce(error);

    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los detalles del contrato')).toBeInTheDocument();
    });
  });

  it('debe mostrar los adjuntos del contrato', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Documento 1')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
    });
  });

  it('debe mostrar los beneficiarios del contrato', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('María Pérez')).toBeInTheDocument();
      expect(screen.getByText('HIJO')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de la firma', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Firmado')).toBeInTheDocument();
      expect(screen.getByText('01/01/2024 10:00')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay adjuntos', async () => {
    (contractsService.getAttachments as any).mockResolvedValueOnce({
      data: [],
    });

    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No hay documentos adjuntos')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay beneficiarios', async () => {
    (contractsService.getBeneficiaries as any).mockResolvedValueOnce({
      data: [],
    });

    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No hay beneficiarios registrados')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando el contrato no está firmado', async () => {
    (contractsService.getSignature as any).mockResolvedValueOnce({
      data: null,
    });

    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('No firmado')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles del cliente', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    });
  });

  it('debe mostrar los detalles de la póliza', async () => {
    render(<ContractDetails contractId="1" />);

    await waitFor(() => {
      expect(screen.getByText('Detalles de la Póliza')).toBeInTheDocument();
      expect(screen.getByText('$1,000.00')).toBeInTheDocument(); // Prima
      expect(screen.getByText('$100,000.00')).toBeInTheDocument(); // Cobertura
    });
  });
}); 