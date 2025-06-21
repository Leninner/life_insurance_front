import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBenefits } from '@/modules/insurances/useBenefits';
import { benefitsService } from '@/modules/insurances/benefits.service';

// Mock del servicio de beneficios
vi.mock('@/modules/insurances/benefits.service', () => ({
  benefitsService: {
    getBenefits: vi.fn(),
    getBenefit: vi.fn(),
    createBenefit: vi.fn(),
    updateBenefit: vi.fn(),
    deleteBenefit: vi.fn(),
  },
}));

describe('useBenefits', () => {
  const mockBenefits = [
    {
      id: '1',
      name: 'Beneficio Básico',
      description: 'Beneficio básico de seguro de vida',
      amount: 50000,
      type: 'LIFE',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Beneficio Premium',
      description: 'Beneficio premium de seguro de vida',
      amount: 100000,
      type: 'LIFE',
      status: 'ACTIVE',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (benefitsService.getBenefits as any).mockResolvedValue({
      data: mockBenefits,
    });
  });

  it('debe cargar los beneficios correctamente', async () => {
    const { result } = renderHook(() => useBenefits());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.benefits).toEqual([]);

    await act(async () => {
      await result.current.loadBenefits();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.benefits).toEqual(mockBenefits);
  });

  it('debe manejar errores al cargar beneficios', async () => {
    const error = new Error('Error al cargar beneficios');
    (benefitsService.getBenefits as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.loadBenefits();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.benefits).toEqual([]);
  });

  it('debe cargar un beneficio específico', async () => {
    const mockBenefit = mockBenefits[0];
    (benefitsService.getBenefit as any).mockResolvedValueOnce({
      data: mockBenefit,
    });

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.loadBenefit('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedBenefit).toEqual(mockBenefit);
  });

  it('debe manejar errores al cargar un beneficio específico', async () => {
    const error = new Error('Error al cargar beneficio');
    (benefitsService.getBenefit as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.loadBenefit('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.selectedBenefit).toBe(null);
  });

  it('debe crear un nuevo beneficio', async () => {
    const newBenefit = {
      name: 'Nuevo Beneficio',
      description: 'Descripción del nuevo beneficio',
      amount: 75000,
      type: 'LIFE',
    };

    (benefitsService.createBenefit as any).mockResolvedValueOnce({
      data: { ...newBenefit, id: '3' },
    });

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.createBenefit(newBenefit);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(benefitsService.createBenefit).toHaveBeenCalledWith(newBenefit);
  });

  it('debe manejar errores al crear un beneficio', async () => {
    const error = new Error('Error al crear beneficio');
    (benefitsService.createBenefit as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.createBenefit({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar un beneficio existente', async () => {
    const updatedBenefit = {
      ...mockBenefits[0],
      name: 'Beneficio Actualizado',
    };

    (benefitsService.updateBenefit as any).mockResolvedValueOnce({
      data: updatedBenefit,
    });

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.updateBenefit('1', updatedBenefit);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(benefitsService.updateBenefit).toHaveBeenCalledWith('1', updatedBenefit);
  });

  it('debe manejar errores al actualizar un beneficio', async () => {
    const error = new Error('Error al actualizar beneficio');
    (benefitsService.updateBenefit as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.updateBenefit('1', {} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un beneficio', async () => {
    (benefitsService.deleteBenefit as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.deleteBenefit('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(benefitsService.deleteBenefit).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar un beneficio', async () => {
    const error = new Error('Error al eliminar beneficio');
    (benefitsService.deleteBenefit as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBenefits());

    await act(async () => {
      await result.current.deleteBenefit('1');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });
}); 