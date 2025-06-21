import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInsurance } from '@/modules/insurances/hooks/useInsurance';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurances: vi.fn(),
    getInsurance: vi.fn(),
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
    deleteInsurance: vi.fn(),
  },
}));

describe('useInsurance', () => {
  const mockInsurance = {
    id: '1',
    name: 'Seguro de Vida',
    type: 'LIFE',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premium: 1000,
    coverage: 100000,
  };

  const mockInsurances = [mockInsurance];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar la lista de seguros correctamente', async () => {
    (insurancesService.getInsurances as any).mockResolvedValueOnce({
      data: mockInsurances,
    });

    const { result } = renderHook(() => useInsurance());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.loadInsurances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insurances).toEqual(mockInsurances);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar seguros', async () => {
    const error = new Error('Error al cargar seguros');
    (insurancesService.getInsurances as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.loadInsurances();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.insurances).toEqual([]);
  });

  it('debe cargar un seguro específico correctamente', async () => {
    (insurancesService.getInsurance as any).mockResolvedValueOnce({
      data: mockInsurance,
    });

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.loadInsurance('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.insurance).toEqual(mockInsurance);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar un seguro específico', async () => {
    const error = new Error('Error al cargar seguro');
    (insurancesService.getInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.loadInsurance('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.insurance).toBeNull();
  });

  it('debe crear un nuevo seguro correctamente', async () => {
    const newInsurance = {
      name: 'Nuevo Seguro',
      type: 'LIFE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 1000,
      coverage: 100000,
    };

    (insurancesService.createInsurance as any).mockResolvedValueOnce({
      data: { id: '2', ...newInsurance },
    });

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.createInsurance(newInsurance);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.createInsurance).toHaveBeenCalledWith(newInsurance);
  });

  it('debe manejar errores al crear seguro', async () => {
    const error = new Error('Error al crear seguro');
    (insurancesService.createInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.createInsurance({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar un seguro correctamente', async () => {
    const updatedInsurance = {
      name: 'Seguro Actualizado',
    };

    (insurancesService.updateInsurance as any).mockResolvedValueOnce({
      data: { ...mockInsurance, ...updatedInsurance },
    });

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.updateInsurance('1', updatedInsurance);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.updateInsurance).toHaveBeenCalledWith('1', updatedInsurance);
  });

  it('debe manejar errores al actualizar seguro', async () => {
    const error = new Error('Error al actualizar seguro');
    (insurancesService.updateInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.updateInsurance('1', {} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un seguro correctamente', async () => {
    (insurancesService.deleteInsurance as any).mockResolvedValueOnce({
      data: null,
    });

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.deleteInsurance('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(insurancesService.deleteInsurance).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar seguro', async () => {
    const error = new Error('Error al eliminar seguro');
    (insurancesService.deleteInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurance());

    await act(async () => {
      await result.current.deleteInsurance('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });
}); 