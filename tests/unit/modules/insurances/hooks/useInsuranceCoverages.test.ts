import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInsuranceCoverages } from '@/modules/insurances/hooks/useInsuranceCoverages';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getCoverages: vi.fn(),
    addCoverage: vi.fn(),
    updateCoverage: vi.fn(),
    deleteCoverage: vi.fn(),
  },
}));

describe('useInsuranceCoverages', () => {
  const mockInsuranceId = '1';
  const mockCoverage = {
    id: '1',
    name: 'Cobertura de Vida',
    amount: 50000,
    description: 'Cobertura por fallecimiento',
  };

  const mockCoverages = [mockCoverage];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar las coberturas correctamente', async () => {
    (insurancesService.getCoverages as any).mockResolvedValueOnce({
      data: mockCoverages,
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.coverages).toEqual(mockCoverages);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar coberturas', async () => {
    const error = new Error('Error al cargar coberturas');
    (insurancesService.getCoverages as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.coverages).toEqual([]);
  });

  it('debe agregar una nueva cobertura correctamente', async () => {
    const newCoverage = {
      name: 'Nueva Cobertura',
      amount: 75000,
      description: 'Nueva descripción',
    };

    (insurancesService.addCoverage as any).mockResolvedValueOnce({
      data: { id: '2', ...newCoverage },
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.addCoverage(newCoverage);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.addCoverage).toHaveBeenCalledWith(
      mockInsuranceId,
      newCoverage
    );
  });

  it('debe manejar errores al agregar cobertura', async () => {
    const error = new Error('Error al agregar cobertura');
    (insurancesService.addCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.addCoverage({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar una cobertura correctamente', async () => {
    const updatedCoverage = {
      amount: 100000,
    };

    (insurancesService.updateCoverage as any).mockResolvedValueOnce({
      data: { ...mockCoverage, ...updatedCoverage },
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.updateCoverage('1', updatedCoverage);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.updateCoverage).toHaveBeenCalledWith(
      mockInsuranceId,
      '1',
      updatedCoverage
    );
  });

  it('debe manejar errores al actualizar cobertura', async () => {
    const error = new Error('Error al actualizar cobertura');
    (insurancesService.updateCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.updateCoverage('1', {} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar una cobertura correctamente', async () => {
    (insurancesService.deleteCoverage as any).mockResolvedValueOnce({
      data: null,
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.deleteCoverage('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.deleteCoverage).toHaveBeenCalledWith(
      mockInsuranceId,
      '1'
    );
  });

  it('debe manejar errores al eliminar cobertura', async () => {
    const error = new Error('Error al eliminar cobertura');
    (insurancesService.deleteCoverage as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.deleteCoverage('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe calcular el total de cobertura correctamente', async () => {
    const mockMultipleCoverages = [
      { ...mockCoverage, amount: 50000 },
      { ...mockCoverage, id: '2', amount: 75000 },
    ];

    (insurancesService.getCoverages as any).mockResolvedValueOnce({
      data: mockMultipleCoverages,
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.totalCoverage).toBe(125000);
  });

  it('debe manejar el caso de no tener coberturas', async () => {
    (insurancesService.getCoverages as any).mockResolvedValueOnce({
      data: [],
    });

    const { result } = renderHook(() => useInsuranceCoverages(mockInsuranceId));

    await act(async () => {
      await result.current.loadCoverages();
    });

    expect(result.current.totalCoverage).toBe(0);
  });
}); 