import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCoverages } from '@/modules/insurances/useCoverages';
import { coverageService } from '@/modules/insurances/coverage.service';

// Mock del servicio de coberturas
vi.mock('@/modules/insurances/coverage.service', () => ({
  coverageService: {
    getCoverages: vi.fn(),
    getCoverage: vi.fn(),
    createCoverage: vi.fn(),
    updateCoverage: vi.fn(),
    deleteCoverage: vi.fn(),
  },
}));

describe('useCoverages', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    (coverageService.getCoverages as any).mockResolvedValue({
      data: mockCoverages,
    });
  });

  it('debe cargar las coberturas correctamente', async () => {
    const { result } = renderHook(() => useCoverages());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.coverages).toEqual([]);

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.coverages).toEqual(mockCoverages);
  });

  it('debe manejar errores al cargar coberturas', async () => {
    const error = new Error('Error al cargar coberturas');
    (coverageService.getCoverages as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.coverages).toEqual([]);
  });

  it('debe cargar una cobertura específica', async () => {
    const mockCoverage = mockCoverages[0];
    (coverageService.getCoverage as any).mockResolvedValueOnce({
      data: mockCoverage,
    });

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.loadCoverage('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedCoverage).toEqual(mockCoverage);
  });

  it('debe manejar errores al cargar una cobertura específica', async () => {
    const error = new Error('Error al cargar cobertura');
    (coverageService.getCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.loadCoverage('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.selectedCoverage).toBe(null);
  });

  it('debe crear una nueva cobertura', async () => {
    const newCoverage = {
      name: 'Nueva Cobertura',
      description: 'Descripción de la nueva cobertura',
      amount: 75000,
      type: 'LIFE',
    };

    (coverageService.createCoverage as any).mockResolvedValueOnce({
      data: { ...newCoverage, id: '3' },
    });

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.createCoverage(newCoverage);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(coverageService.createCoverage).toHaveBeenCalledWith(newCoverage);
  });

  it('debe manejar errores al crear una cobertura', async () => {
    const error = new Error('Error al crear cobertura');
    (coverageService.createCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.createCoverage({} as any);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar una cobertura existente', async () => {
    const updatedCoverage = {
      ...mockCoverages[0],
      name: 'Cobertura Actualizada',
    };

    (coverageService.updateCoverage as any).mockResolvedValueOnce({
      data: updatedCoverage,
    });

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.updateCoverage('1', updatedCoverage);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(coverageService.updateCoverage).toHaveBeenCalledWith('1', updatedCoverage);
  });

  it('debe manejar errores al actualizar una cobertura', async () => {
    const error = new Error('Error al actualizar cobertura');
    (coverageService.updateCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.updateCoverage('1', {} as any);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar una cobertura', async () => {
    (coverageService.deleteCoverage as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.deleteCoverage('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(coverageService.deleteCoverage).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar una cobertura', async () => {
    const error = new Error('Error al eliminar cobertura');
    (coverageService.deleteCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCoverages());

    await act(async () => {
      await result.current.deleteCoverage('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });
}); 