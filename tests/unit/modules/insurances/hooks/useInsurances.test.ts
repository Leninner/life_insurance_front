import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInsurances } from '@/modules/insurances/useInsurances';
import { insurancesService } from '@/modules/insurances/insurances.service';

// Mock del servicio de seguros
vi.mock('@/modules/insurances/insurances.service', () => ({
  insurancesService: {
    getInsurances: vi.fn(),
    getInsurance: vi.fn(),
    createInsurance: vi.fn(),
    updateInsurance: vi.fn(),
    deleteInsurance: vi.fn(),
    getInsurancePlans: vi.fn(),
  },
}));

describe('useInsurances', () => {
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
      phone: '1234567890',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (insurancesService.getInsurances as any).mockResolvedValue({
      data: [mockInsurance],
    });
  });

  it('debe cargar los seguros correctamente', async () => {
    const { result } = renderHook(() => useInsurances());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.insurances).toEqual([]);

    await act(async () => {
      await result.current.loadInsurances();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.insurances).toEqual([mockInsurance]);
  });

  it('debe manejar errores al cargar seguros', async () => {
    const error = new Error('Error al cargar seguros');
    (insurancesService.getInsurances as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.loadInsurances();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.insurances).toEqual([]);
  });

  it('debe cargar un seguro específico', async () => {
    (insurancesService.getInsurance as any).mockResolvedValueOnce({
      data: mockInsurance,
    });

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.loadInsurance('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedInsurance).toEqual(mockInsurance);
  });

  it('debe manejar errores al cargar un seguro específico', async () => {
    const error = new Error('Error al cargar seguro');
    (insurancesService.getInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.loadInsurance('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.selectedInsurance).toBe(null);
  });

  it('debe crear un nuevo seguro', async () => {
    const newInsurance = {
      name: 'Nuevo Seguro',
      type: 'LIFE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 1000,
      coverage: 100000,
      clientId: '1',
    };

    (insurancesService.createInsurance as any).mockResolvedValueOnce({
      data: { ...newInsurance, id: '2' },
    });

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.createInsurance(newInsurance);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(insurancesService.createInsurance).toHaveBeenCalledWith(newInsurance);
  });

  it('debe manejar errores al crear un seguro', async () => {
    const error = new Error('Error al crear seguro');
    (insurancesService.createInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.createInsurance({} as any);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar un seguro existente', async () => {
    const updatedInsurance = {
      ...mockInsurance,
      name: 'Seguro Actualizado',
    };

    (insurancesService.updateInsurance as any).mockResolvedValueOnce({
      data: updatedInsurance,
    });

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.updateInsurance('1', updatedInsurance);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(insurancesService.updateInsurance).toHaveBeenCalledWith('1', updatedInsurance);
  });

  it('debe manejar errores al actualizar un seguro', async () => {
    const error = new Error('Error al actualizar seguro');
    (insurancesService.updateInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.updateInsurance('1', {} as any);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un seguro', async () => {
    (insurancesService.deleteInsurance as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.deleteInsurance('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(insurancesService.deleteInsurance).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar un seguro', async () => {
    const error = new Error('Error al eliminar seguro');
    (insurancesService.deleteInsurance as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.deleteInsurance('1');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe cargar los planes de seguro', async () => {
    const mockPlans = [
      {
        id: '1',
        name: 'Plan Básico',
        description: 'Plan básico de seguro de vida',
        coverage: 50000,
        premium: 100,
        features: ['Cobertura por fallecimiento', 'Asistencia médica'],
      },
    ];

    (insurancesService.getInsurancePlans as any).mockResolvedValueOnce({
      data: mockPlans,
    });

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.loadInsurancePlans();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.plans).toEqual(mockPlans);
  });

  it('debe manejar errores al cargar planes de seguro', async () => {
    const error = new Error('Error al cargar planes');
    (insurancesService.getInsurancePlans as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useInsurances());

    await act(async () => {
      await result.current.loadInsurancePlans();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.plans).toEqual([]);
  });
}); 