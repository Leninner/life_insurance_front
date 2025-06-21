import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coverageService } from '@/modules/insurances/coverage.service';
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

describe('coverageService', () => {
  const mockCoverage = {
    id: '1',
    name: 'Cobertura Básica',
    description: 'Cobertura básica de seguro de vida',
    amount: 50000,
    type: 'LIFE',
    status: 'ACTIVE',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener todas las coberturas', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: [mockCoverage],
    });

    const result = await coverageService.getCoverages();

    expect(api.get).toHaveBeenCalledWith('/coverages');
    expect(result).toEqual([mockCoverage]);
  });

  it('debe obtener una cobertura por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: mockCoverage,
    });

    const result = await coverageService.getCoverage('1');

    expect(api.get).toHaveBeenCalledWith('/coverages/1');
    expect(result).toEqual(mockCoverage);
  });

  it('debe crear una nueva cobertura', async () => {
    const newCoverage = {
      name: 'Nueva Cobertura',
      description: 'Descripción de la nueva cobertura',
      amount: 75000,
      type: 'LIFE',
    };

    (api.post as any).mockResolvedValueOnce({
      data: { ...newCoverage, id: '2' },
    });

    const result = await coverageService.createCoverage(newCoverage);

    expect(api.post).toHaveBeenCalledWith('/coverages', newCoverage);
    expect(result).toEqual({ ...newCoverage, id: '2' });
  });

  it('debe actualizar una cobertura existente', async () => {
    const updatedCoverage = {
      ...mockCoverage,
      name: 'Cobertura Actualizada',
    };

    (api.put as any).mockResolvedValueOnce({
      data: updatedCoverage,
    });

    const result = await coverageService.updateCoverage('1', updatedCoverage);

    expect(api.put).toHaveBeenCalledWith('/coverages/1', updatedCoverage);
    expect(result).toEqual(updatedCoverage);
  });

  it('debe eliminar una cobertura', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    const result = await coverageService.deleteCoverage('1');

    expect(api.delete).toHaveBeenCalledWith('/coverages/1');
    expect(result).toEqual({ success: true });
  });

  it('debe manejar errores al obtener coberturas', async () => {
    const error = new Error('Error al obtener coberturas');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(coverageService.getCoverages()).rejects.toThrow('Error al obtener coberturas');
  });

  it('debe manejar errores al obtener una cobertura', async () => {
    const error = new Error('Error al obtener cobertura');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(coverageService.getCoverage('1')).rejects.toThrow('Error al obtener cobertura');
  });

  it('debe manejar errores al crear una cobertura', async () => {
    const error = new Error('Error al crear cobertura');
    (api.post as any).mockRejectedValueOnce(error);

    await expect(coverageService.createCoverage(mockCoverage)).rejects.toThrow('Error al crear cobertura');
  });

  it('debe manejar errores al actualizar una cobertura', async () => {
    const error = new Error('Error al actualizar cobertura');
    (api.put as any).mockRejectedValueOnce(error);

    await expect(coverageService.updateCoverage('1', mockCoverage)).rejects.toThrow('Error al actualizar cobertura');
  });

  it('debe manejar errores al eliminar una cobertura', async () => {
    const error = new Error('Error al eliminar cobertura');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(coverageService.deleteCoverage('1')).rejects.toThrow('Error al eliminar cobertura');
  });
}); 