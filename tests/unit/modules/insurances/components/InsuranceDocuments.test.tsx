import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InsuranceDocuments } from '@/modules/insurances/components/InsuranceDocuments';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getDocuments: vi.fn(),
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

describe('InsuranceDocuments', () => {
  const mockInsuranceId = '1';
  const mockDocuments = [
    {
      id: '1',
      name: 'Documento 1',
      type: 'PDF',
      url: 'http://example.com/doc1.pdf',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Documento 2',
      type: 'PDF',
      url: 'http://example.com/doc2.pdf',
      createdAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getDocuments as any).mockResolvedValue({
      data: mockDocuments,
    });
  });

  it('debe renderizar la lista de documentos correctamente', async () => {
    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      expect(screen.getByText('Documento 1')).toBeInTheDocument();
      expect(screen.getByText('Documento 2')).toBeInTheDocument();
    });
  });

  it('debe mostrar el estado de carga inicial', () => {
    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('debe manejar errores de carga', async () => {
    const error = new Error('Error al cargar documentos');
    (insurancesService.getDocuments as any).mockRejectedValueOnce(error);

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los documentos')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay documentos', async () => {
    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: [],
    });

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      expect(screen.getByText('No hay documentos adjuntos')).toBeInTheDocument();
    });
  });

  it('debe subir un nuevo documento correctamente', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    (insurancesService.uploadDocument as any).mockResolvedValueOnce({
      data: {
        id: '3',
        name: 'test.pdf',
        type: 'PDF',
        url: 'http://example.com/test.pdf',
      },
    });

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    const fileInput = screen.getByLabelText('Seleccionar archivo');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(insurancesService.uploadDocument).toHaveBeenCalledWith(
        mockInsuranceId,
        expect.any(FormData)
      );
    });
  });

  it('debe manejar errores al subir documento', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const error = new Error('Error al subir documento');
    (insurancesService.uploadDocument as any).mockRejectedValueOnce(error);

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    const fileInput = screen.getByLabelText('Seleccionar archivo');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Error al subir el documento')).toBeInTheDocument();
    });
  });

  it('debe eliminar un documento correctamente', async () => {
    (insurancesService.deleteDocument as any).mockResolvedValueOnce({
      data: null,
    });

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Eliminar documento');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(insurancesService.deleteDocument).toHaveBeenCalledWith(
        mockInsuranceId,
        '1'
      );
    });
  });

  it('debe manejar errores al eliminar documento', async () => {
    const error = new Error('Error al eliminar documento');
    (insurancesService.deleteDocument as any).mockRejectedValueOnce(error);

    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByLabelText('Eliminar documento');
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el documento')).toBeInTheDocument();
    });
  });

  it('debe mostrar el tipo de documento correctamente', async () => {
    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      expect(screen.getAllByText('PDF')).toHaveLength(2);
    });
  });

  it('debe mostrar la fecha de creación del documento', async () => {
    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      expect(screen.getByText('01/01/2024')).toBeInTheDocument();
      expect(screen.getByText('02/01/2024')).toBeInTheDocument();
    });
  });

  it('debe tener enlaces de descarga para los documentos', async () => {
    render(<InsuranceDocuments insuranceId={mockInsuranceId} />);

    await waitFor(() => {
      const downloadLinks = screen.getAllByLabelText('Descargar documento');
      expect(downloadLinks).toHaveLength(2);
      expect(downloadLinks[0]).toHaveAttribute('href', 'http://example.com/doc1.pdf');
      expect(downloadLinks[1]).toHaveAttribute('href', 'http://example.com/doc2.pdf');
    });
  });
}); 