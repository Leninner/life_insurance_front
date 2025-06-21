import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContract } from '@/modules/contracts/hooks/useContract';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getContract: vi.fn(),
    createContract: vi.fn(),
    updateContract: vi.fn(),
    deleteContract: vi.fn(),
  },
}));

describe('useContract', () => {
  const mockContract = {
    id: '1',
    name: 'Contrato de Vida',
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
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe cargar un contrato correctamente', async () => {
    (contractsService.getContract as any).mockResolvedValueOnce({
      data: mockContract,
    });

    const { result } = renderHook(() => useContract('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.contract).toBe(null);

    await act(async () => {
      await result.current.loadContract();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.contract).toEqual(mockContract);
  });

  it('debe manejar errores al cargar un contrato', async () => {
    const error = new Error('Error al cargar contrato');
    (contractsService.getContract as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      await result.current.loadContract();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.contract).toBe(null);
  });

  it('debe crear un contrato correctamente', async () => {
    const newContract = {
      name: 'Nuevo Contrato',
      type: 'LIFE',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      premium: 1000,
      coverage: 100000,
      clientId: '1',
    };

    (contractsService.createContract as any).mockResolvedValueOnce({
      data: { id: '2', ...newContract, status: 'PENDING' },
    });

    const { result } = renderHook(() => useContract());

    await act(async () => {
      await result.current.createContract(newContract);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.createContract).toHaveBeenCalledWith(newContract);
  });

  it('debe manejar errores al crear un contrato', async () => {
    const error = new Error('Error al crear contrato');
    (contractsService.createContract as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContract());

    await act(async () => {
      await result.current.createContract({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe actualizar un contrato correctamente', async () => {
    const updatedContract = {
      name: 'Contrato Actualizado',
    };

    (contractsService.updateContract as any).mockResolvedValueOnce({
      data: { ...mockContract, ...updatedContract },
    });

    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      await result.current.updateContract(updatedContract);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.updateContract).toHaveBeenCalledWith('1', updatedContract);
  });

  it('debe manejar errores al actualizar un contrato', async () => {
    const error = new Error('Error al actualizar contrato');
    (contractsService.updateContract as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      await result.current.updateContract({} as any);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe eliminar un contrato correctamente', async () => {
    (contractsService.deleteContract as any).mockResolvedValueOnce({});

    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      await result.current.deleteContract();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(contractsService.deleteContract).toHaveBeenCalledWith('1');
  });

  it('debe manejar errores al eliminar un contrato', async () => {
    const error = new Error('Error al eliminar contrato');
    (contractsService.deleteContract as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      await result.current.deleteContract();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  it('debe limpiar el estado del contrato', async () => {
    const { result } = renderHook(() => useContract('1'));

    await act(async () => {
      result.current.clearContract();
    });

    expect(result.current.contract).toBe(null);
    expect(result.current.error).toBe(null);
  });
}); 