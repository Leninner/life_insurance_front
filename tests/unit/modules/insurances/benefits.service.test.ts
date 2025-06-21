import { describe, it, expect, vi, beforeEach } from 'vitest';
import { benefitsService } from '@/modules/insurances/benefits.service';
import { api } from '@/lib/api';

// Mock de la API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('benefitsService', () => {
  const mockBenefit = {
    id: '1',
    name: 'Beneficio Básico',
    description: 'Beneficio básico de seguro de vida',
    amount: 50000,
    type: 'LIFE',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener todos los beneficios', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [mockBenefit],
    });

    const result = await benefitsService.getBenefits();

    expect(api.get).toHaveBeenCalledWith('/benefits');
    expect(result).toEqual([mockBenefit]);
  });

  it('debe obtener un beneficio por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: mockBenefit,
    });

    const result = await benefitsService.getBenefit('1');

    expect(api.get).toHaveBeenCalledWith('/benefits/1');
    expect(result).toEqual(mockBenefit);
  });

  it('debe crear un nuevo beneficio', async () => {
    const newBenefit = {
      name: 'Nuevo Beneficio',
      description: 'Descripción del nuevo beneficio',
      amount: 75000,
      type: 'LIFE',
    };

    (api.post as any).mockResolvedValueOnce({
      data: { ...newBenefit, id: '2' },
    });

    const result = await benefitsService.createBenefit(newBenefit);

    expect(api.post).toHaveBeenCalledWith('/benefits', newBenefit);
    expect(result).toEqual({ ...newBenefit, id: '2' });
  });

  it('debe actualizar un beneficio existente', async () => {
    const updatedBenefit = {
      ...mockBenefit,
      name: 'Beneficio Actualizado',
    };

    (api.put as any).mockResolvedValueOnce({
      data: updatedBenefit,
    });

    const result = await benefitsService.updateBenefit('1', updatedBenefit);

    expect(api.put).toHaveBeenCalledWith('/benefits/1', updatedBenefit);
    expect(result).toEqual(updatedBenefit);
  });

  it('debe eliminar un beneficio', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await benefitsService.deleteBenefit('1');

    expect(api.delete).toHaveBeenCalledWith('/benefits/1');
    expect(result).toEqual({ success: true });
  });

  it('debe manejar errores al obtener beneficios', async () => {
    const error = new Error('Error al obtener beneficios');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(benefitsService.getBenefits()).rejects.toThrow('Error al obtener beneficios');
  });

  it('debe manejar errores al obtener un beneficio', async () => {
    const error = new Error('Error al obtener beneficio');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(benefitsService.getBenefit('1')).rejects.toThrow('Error al obtener beneficio');
  });

  it('debe manejar errores al crear un beneficio', async () => {
    const error = new Error('Error al crear beneficio');
    (api.post as any).mockRejectedValueOnce(error);

    await expect(benefitsService.createBenefit(mockBenefit)).rejects.toThrow('Error al crear beneficio');
  });

  it('debe manejar errores al actualizar un beneficio', async () => {
    const error = new Error('Error al actualizar beneficio');
    (api.put as any).mockRejectedValueOnce(error);

    await expect(benefitsService.updateBenefit('1', mockBenefit)).rejects.toThrow('Error al actualizar beneficio');
  });

  it('debe manejar errores al eliminar un beneficio', async () => {
    const error = new Error('Error al eliminar beneficio');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(benefitsService.deleteBenefit('1')).rejects.toThrow('Error al eliminar beneficio');
  });
}); 