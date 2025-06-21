import { describe, it, expect, vi, beforeEach } from 'vitest';
import { insurancesService } from '@/modules/insurances/insurances.service';
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

describe('insurancesService', () => {
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
  });

  it('debe obtener todos los seguros', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [mockInsurance],
    });

    const result = await insurancesService.getInsurances();

    expect(api.get).toHaveBeenCalledWith('/insurances');
    expect(result).toEqual([mockInsurance]);
  });

  it('debe obtener un seguro por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: mockInsurance,
    });

    const result = await insurancesService.getInsurance('1');

    expect(api.get).toHaveBeenCalledWith('/insurances/1');
    expect(result).toEqual(mockInsurance);
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

    (api.post as any).mockResolvedValueOnce({
      data: { ...newInsurance, id: '2' },
    });

    const result = await insurancesService.createInsurance(newInsurance);

    expect(api.post).toHaveBeenCalledWith('/insurances', newInsurance);
    expect(result).toEqual({ ...newInsurance, id: '2' });
  });

  it('debe actualizar un seguro existente', async () => {
    const updatedInsurance = {
      ...mockInsurance,
      name: 'Seguro Actualizado',
    };

    (api.put as any).mockResolvedValueOnce({
      data: updatedInsurance,
    });

    const result = await insurancesService.updateInsurance('1', updatedInsurance);

    expect(api.put).toHaveBeenCalledWith('/insurances/1', updatedInsurance);
    expect(result).toEqual(updatedInsurance);
  });

  it('debe eliminar un seguro', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await insurancesService.deleteInsurance('1');

    expect(api.delete).toHaveBeenCalledWith('/insurances/1');
    expect(result).toEqual({ success: true });
  });

  it('debe obtener los planes de seguro', async () => {
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

    (api.get as any).mockResolvedValueOnce({
      data: mockPlans,
    });

    const result = await insurancesService.getInsurancePlans();

    expect(api.get).toHaveBeenCalledWith('/insurances/plans');
    expect(result).toEqual(mockPlans);
  });

  it('debe manejar errores al obtener seguros', async () => {
    const error = new Error('Error al obtener seguros');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(insurancesService.getInsurances()).rejects.toThrow('Error al obtener seguros');
  });

  it('debe manejar errores al obtener un seguro', async () => {
    const error = new Error('Error al obtener seguro');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(insurancesService.getInsurance('1')).rejects.toThrow('Error al obtener seguro');
  });

  it('debe manejar errores al crear un seguro', async () => {
    const error = new Error('Error al crear seguro');
    (api.post as any).mockRejectedValueOnce(error);

    await expect(insurancesService.createInsurance(mockInsurance)).rejects.toThrow('Error al crear seguro');
  });

  it('debe manejar errores al actualizar un seguro', async () => {
    const error = new Error('Error al actualizar seguro');
    (api.put as any).mockRejectedValueOnce(error);

    await expect(insurancesService.updateInsurance('1', mockInsurance)).rejects.toThrow('Error al actualizar seguro');
  });

  it('debe manejar errores al eliminar un seguro', async () => {
    const error = new Error('Error al eliminar seguro');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(insurancesService.deleteInsurance('1')).rejects.toThrow('Error al eliminar seguro');
  });

  it('debe manejar errores al obtener planes de seguro', async () => {
    const error = new Error('Error al obtener planes');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(insurancesService.getInsurancePlans()).rejects.toThrow('Error al obtener planes');
  });
}); 