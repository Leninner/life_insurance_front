import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contractsService } from '@/modules/contracts/contracts.service';
import { getHttpClient } from '@/lib/http';

// Mock del cliente HTTP
vi.mock('@/lib/http', () => ({
  getHttpClient: vi.fn().mockResolvedValue({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));

describe('ContractsService', () => {
  const mockApi = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (getHttpClient as any).mockResolvedValue(mockApi);
  });

  describe('getContracts', () => {
    it('debe obtener la lista de contratos correctamente', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', name: 'Contrato 1' },
            { id: '2', name: 'Contrato 2' },
          ],
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getContracts();

      expect(mockApi.get).toHaveBeenCalledWith('/contracts', { params: undefined });
      expect(result).toEqual(mockResponse.data);
    });

    it('debe manejar los parámetros de filtrado', async () => {
      const params = { status: 'active', page: 1 };
      const mockResponse = {
        data: {
          data: [{ id: '1', name: 'Contrato 1' }],
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getContracts(params);

      expect(mockApi.get).toHaveBeenCalledWith('/contracts', { params });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getContract', () => {
    it('debe obtener un contrato específico por ID', async () => {
      const mockResponse = {
        data: {
          data: { id: '1', name: 'Contrato 1' },
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getContract('1');

      expect(mockApi.get).toHaveBeenCalledWith('/contracts/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createContract', () => {
    it('debe crear un nuevo contrato correctamente', async () => {
      const contractData = {
        name: 'Nuevo Contrato',
        type: 'LIFE',
        startDate: '2024-01-01',
      };
      const mockResponse = {
        data: {
          data: { id: '1', ...contractData },
        },
      };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.createContract(contractData);

      expect(mockApi.post).toHaveBeenCalledWith('/contracts', contractData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateContract', () => {
    it('debe actualizar un contrato existente', async () => {
      const contractData = {
        name: 'Contrato Actualizado',
      };
      const mockResponse = {
        data: {
          data: { id: '1', ...contractData },
        },
      };
      mockApi.put.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.updateContract('1', contractData);

      expect(mockApi.put).toHaveBeenCalledWith('/contracts/1', contractData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteContract', () => {
    it('debe eliminar un contrato correctamente', async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockApi.delete.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.deleteContract('1');

      expect(mockApi.delete).toHaveBeenCalledWith('/contracts/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Gestión de Adjuntos', () => {
    it('debe obtener los adjuntos de un contrato', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', name: 'Documento 1' },
            { id: '2', name: 'Documento 2' },
          ],
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getAttachments('1');

      expect(mockApi.get).toHaveBeenCalledWith('/contracts/1/attachments');
      expect(result).toEqual(mockResponse.data);
    });

    it('debe subir un adjunto', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['test']));
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.uploadAttachment('1', formData);

      expect(mockApi.post).toHaveBeenCalledWith('/contracts/1/attachments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('debe eliminar un adjunto', async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockApi.delete.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.deleteAttachment('1', '1');

      expect(mockApi.delete).toHaveBeenCalledWith('/contracts/1/attachments/1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Gestión de Firmas', () => {
    it('debe firmar un contrato', async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.signContract('1');

      expect(mockApi.post).toHaveBeenCalledWith('/contracts/1/sign');
      expect(result).toEqual(mockResponse.data);
    });

    it('debe obtener la firma de un contrato', async () => {
      const mockResponse = {
        data: {
          data: { signature: 'base64-signature' },
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getSignature('1');

      expect(mockApi.get).toHaveBeenCalledWith('/contracts/1/signature');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Gestión de Beneficiarios', () => {
    it('debe obtener los beneficiarios de un contrato', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: '1', name: 'Beneficiario 1' },
            { id: '2', name: 'Beneficiario 2' },
          ],
        },
      };
      mockApi.get.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.getBeneficiaries('1');

      expect(mockApi.get).toHaveBeenCalledWith('/contracts/1/beneficiaries');
      expect(result).toEqual(mockResponse.data);
    });

    it('debe agregar un beneficiario', async () => {
      const beneficiaryData = {
        name: 'Nuevo Beneficiario',
        relationship: 'HIJO',
        percentage: 100,
      };
      const mockResponse = {
        data: {
          data: { id: '1', ...beneficiaryData },
        },
      };
      mockApi.post.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.addBeneficiary('1', beneficiaryData);

      expect(mockApi.post).toHaveBeenCalledWith('/contracts/1/beneficiaries', beneficiaryData);
      expect(result).toEqual(mockResponse.data);
    });

    it('debe actualizar un beneficiario', async () => {
      const beneficiaryData = {
        percentage: 50,
      };
      const mockResponse = {
        data: {
          data: { id: '1', ...beneficiaryData },
        },
      };
      mockApi.put.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.updateBeneficiary('1', '1', beneficiaryData);

      expect(mockApi.put).toHaveBeenCalledWith('/contracts/1/beneficiaries/1', beneficiaryData);
      expect(result).toEqual(mockResponse.data);
    });

    it('debe eliminar un beneficiario', async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };
      mockApi.delete.mockResolvedValueOnce(mockResponse);

      const result = await contractsService.deleteBeneficiary('1', '1');

      expect(mockApi.delete).toHaveBeenCalledWith('/contracts/1/beneficiaries/1');
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 