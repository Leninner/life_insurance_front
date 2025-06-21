import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContractDocuments } from '@/modules/contracts/components/ContractDocuments';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getAttachments: vi.fn(),
    uploadAttachment: vi.fn(),
    deleteAttachment: vi.fn(),
  },
}));

describe('ContractDocuments', () => {
  const mockAttachments = [
    {
      id: '1',
      name: 'Documento 1',
      type: 'PDF',
      url: 'http://example.com/doc1.pdf',
      uploadedAt: '2024-01-01T10:00:00Z',
    },
  ];

  const mockContractId = '1';

  beforeEach(() => {
    vi.clearAllMocks();
    (contractsService.getAttachments as any).mockResolvedValue({
      data: mockAttachments,
    });
  });

  it('debe renderizar el componente correctamente', async () => {
    render(<ContractDocuments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Documentos del Contrato')).toBeInTheDocument();
      expect(screen.getByText('Subir Documento')).toBeInTheDocument();
    });
  });

  it('debe mostrar la lista de documentos', async () => {
    render(<ContractDocuments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Documento 1')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('01/01/2024 10:00')).toBeInTheDocument();
    });
  });

  it('debe mostrar el formulario de subir documento', async () => {
    render(<ContractDocuments contractId={mockContractId} />);

    const uploadButton = screen.getByText('Subir Documento');
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre del Documento')).toBeInTheDocument();
      expect(screen.getByLabelText('Tipo de Documento')).toBeInTheDocument();
      expect(screen.getByLabelText('Archivo')).toBeInTheDocument();
    });
  });

  it('debe subir un nuevo documento correctamente', async () => {
    const newDocument = {
      name: 'Nuevo Documento',
      type: 'PDF',
      file: new File([''], 'test.pdf', { type: 'application/pdf' }),
    };

    (contractsService.uploadAttachment as any).mockResolvedValueOnce({
      data: {
        id: '2',
        ...newDocument,
        url: 'http://example.com/test.pdf',
        uploadedAt: '2024-01-02T10:00:00Z',
      },
    });

    render(<ContractDocuments contractId={mockContractId} />);

    const uploadButton = screen.getByText('Subir Documento');
    fireEvent.click(uploadButton);

    fireEvent.change(screen.getByLabelText('Nombre del Documento'), {
      target: { value: newDocument.name },
    });
    fireEvent.change(screen.getByLabelText('Tipo de Documento'), {
      target: { value: newDocument.type },
    });
    fireEvent.change(screen.getByLabelText('Archivo'), {
      target: { files: [newDocument.file] },
    });

    const submitButton = screen.getByText('Subir');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.uploadAttachment).toHaveBeenCalledWith(
        mockContractId,
        expect.any(FormData)
      );
      expect(screen.getByText('Nuevo Documento')).toBeInTheDocument();
    });
  });

  it('debe eliminar un documento correctamente', async () => {
    (contractsService.deleteAttachment as any).mockResolvedValueOnce({});

    render(<ContractDocuments contractId={mockContractId} />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Eliminar');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(contractsService.deleteAttachment).toHaveBeenCalledWith(
        mockContractId,
        '1'
      );
      expect(screen.queryByText('Documento 1')).not.toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay documentos', async () => {
    (contractsService.getAttachments as any).mockResolvedValueOnce({
      data: [],
    });

    render(<ContractDocuments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('No hay documentos adjuntos')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar documentos', async () => {
    const error = new Error('Error al cargar documentos');
    (contractsService.getAttachments as any).mockRejectedValueOnce(error);

    render(<ContractDocuments contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los documentos')).toBeInTheDocument();
    });
  });

  it('debe validar el tipo de archivo permitido', async () => {
    render(<ContractDocuments contractId={mockContractId} />);

    const uploadButton = screen.getByText('Subir Documento');
    fireEvent.click(uploadButton);

    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
    fireEvent.change(screen.getByLabelText('Archivo'), {
      target: { files: [invalidFile] },
    });

    const submitButton = screen.getByText('Subir');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Solo se permiten archivos PDF')).toBeInTheDocument();
    });
  });

  it('debe validar el tamaño máximo del archivo', async () => {
    render(<ContractDocuments contractId={mockContractId} />);

    const uploadButton = screen.getByText('Subir Documento');
    fireEvent.click(uploadButton);

    const largeFile = new File([''], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 }); // 11MB

    fireEvent.change(screen.getByLabelText('Archivo'), {
      target: { files: [largeFile] },
    });

    const submitButton = screen.getByText('Subir');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El archivo no puede ser mayor a 10MB')).toBeInTheDocument();
    });
  });
}); 