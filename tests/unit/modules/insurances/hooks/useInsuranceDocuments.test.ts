import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInsuranceDocuments } from '@/modules/insurances/hooks/useInsuranceDocuments';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getDocuments: vi.fn(),
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

describe('useInsuranceDocuments', () => {
  const mockInsuranceId = '1';
  const mockDocument = {
    id: '1',
    name: 'Documento 1',
    type: 'PDF',
    url: 'http://example.com/doc1.pdf',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockDocuments = [mockDocument];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar los documentos correctamente', async () => {
    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: mockDocuments,
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.loadDocuments();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.documents).toEqual(mockDocuments);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar documentos', async () => {
    const error = new Error('Error al cargar documentos');
    (insurancesService.getDocuments as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.loadDocuments();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.documents).toEqual([]);
  });

  it('debe subir un nuevo documento correctamente', async () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('file', file);

    (insurancesService.uploadDocument as any).mockResolvedValueOnce({
      data: {
        id: '2',
        name: 'test.pdf',
        type: 'PDF',
        url: 'http://example.com/test.pdf',
      },
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.uploadDocument(formData);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.uploadDocument).toHaveBeenCalledWith(
      mockInsuranceId,
      formData
    );
  });

  it('debe manejar errores al subir documento', async () => {
    const error = new Error('Error al subir documento');
    (insurancesService.uploadDocument as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.uploadDocument(new FormData());
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un documento correctamente', async () => {
    (insurancesService.deleteDocument as any).mockResolvedValueOnce({
      data: null,
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.deleteDocument('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.deleteDocument).toHaveBeenCalledWith(
      mockInsuranceId,
      '1'
    );
  });

  it('debe manejar errores al eliminar documento', async () => {
    const error = new Error('Error al eliminar documento');
    (insurancesService.deleteDocument as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.deleteDocument('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe filtrar documentos por tipo', async () => {
    const mockMultipleDocuments = [
      { ...mockDocument, type: 'PDF' },
      { ...mockDocument, id: '2', type: 'DOC' },
    ];

    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: mockMultipleDocuments,
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.loadDocuments();
      result.current.setDocumentType('PDF');
    });

    expect(result.current.filteredDocuments).toHaveLength(1);
    expect(result.current.filteredDocuments[0].type).toBe('PDF');
  });

  it('debe ordenar documentos por fecha de creación', async () => {
    const mockMultipleDocuments = [
      { ...mockDocument, createdAt: '2024-01-02T00:00:00.000Z' },
      { ...mockDocument, id: '2', createdAt: '2024-01-01T00:00:00.000Z' },
    ];

    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: mockMultipleDocuments,
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.loadDocuments();
      result.current.setSortOrder('asc');
    });

    expect(result.current.sortedDocuments[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
    expect(result.current.sortedDocuments[1].createdAt).toBe('2024-01-02T00:00:00.000Z');
  });

  it('debe manejar el caso de no tener documentos', async () => {
    (insurancesService.getDocuments as any).mockResolvedValueOnce({
      data: [],
    });

    const { result } = renderHook(() => useInsuranceDocuments(mockInsuranceId));

    await act(async () => {
      await result.current.loadDocuments();
    });

    expect(result.current.documents).toEqual([]);
    expect(result.current.filteredDocuments).toEqual([]);
    expect(result.current.sortedDocuments).toEqual([]);
  });
}); 