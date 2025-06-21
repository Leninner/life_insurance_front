import { describe, it, expect } from 'vitest';
import {
  CONTRACT_STATUS,
  CONTRACT_TYPES,
  PAYMENT_FREQUENCIES,
  PAYMENT_METHODS,
  CONTRACT_DOCUMENT_TYPES,
} from '@/modules/contracts/constants/contract.constants';

describe('Contract Constants', () => {
  describe('CONTRACT_STATUS', () => {
    it('debe tener los estados correctos', () => {
      expect(CONTRACT_STATUS).toEqual({
        ACTIVE: 'ACTIVE',
        PENDING: 'PENDING',
        EXPIRED: 'EXPIRED',
        CANCELLED: 'CANCELLED',
      });
    });

    it('debe tener valores únicos', () => {
      const values = Object.values(CONTRACT_STATUS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('CONTRACT_TYPES', () => {
    it('debe tener los tipos correctos', () => {
      expect(CONTRACT_TYPES).toEqual({
        LIFE: 'LIFE',
        HEALTH: 'HEALTH',
        AUTO: 'AUTO',
        HOME: 'HOME',
      });
    });

    it('debe tener valores únicos', () => {
      const values = Object.values(CONTRACT_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('PAYMENT_FREQUENCIES', () => {
    it('debe tener las frecuencias correctas', () => {
      expect(PAYMENT_FREQUENCIES).toEqual({
        MONTHLY: 'MONTHLY',
        QUARTERLY: 'QUARTERLY',
        SEMIANNUAL: 'SEMIANNUAL',
        ANNUAL: 'ANNUAL',
      });
    });

    it('debe tener valores únicos', () => {
      const values = Object.values(PAYMENT_FREQUENCIES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('PAYMENT_METHODS', () => {
    it('debe tener los métodos de pago correctos', () => {
      expect(PAYMENT_METHODS).toEqual({
        CREDIT_CARD: 'CREDIT_CARD',
        DEBIT_CARD: 'DEBIT_CARD',
        BANK_TRANSFER: 'BANK_TRANSFER',
        CASH: 'CASH',
      });
    });

    it('debe tener valores únicos', () => {
      const values = Object.values(PAYMENT_METHODS);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('CONTRACT_DOCUMENT_TYPES', () => {
    it('debe tener los tipos de documento correctos', () => {
      expect(CONTRACT_DOCUMENT_TYPES).toEqual({
        CONTRACT: 'CONTRACT',
        POLICY: 'POLICY',
        RECEIPT: 'RECEIPT',
        CLAIM: 'CLAIM',
        OTHER: 'OTHER',
      });
    });

    it('debe tener valores únicos', () => {
      const values = Object.values(CONTRACT_DOCUMENT_TYPES);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('Relaciones entre constantes', () => {
    it('debe tener estados válidos para contratos', () => {
      const validStatuses = Object.values(CONTRACT_STATUS);
      expect(validStatuses).toContain('ACTIVE');
      expect(validStatuses).toContain('PENDING');
      expect(validStatuses).toContain('EXPIRED');
      expect(validStatuses).toContain('CANCELLED');
    });

    it('debe tener tipos válidos para contratos', () => {
      const validTypes = Object.values(CONTRACT_TYPES);
      expect(validTypes).toContain('LIFE');
      expect(validTypes).toContain('HEALTH');
      expect(validTypes).toContain('AUTO');
      expect(validTypes).toContain('HOME');
    });

    it('debe tener frecuencias de pago válidas', () => {
      const validFrequencies = Object.values(PAYMENT_FREQUENCIES);
      expect(validFrequencies).toContain('MONTHLY');
      expect(validFrequencies).toContain('QUARTERLY');
      expect(validFrequencies).toContain('SEMIANNUAL');
      expect(validFrequencies).toContain('ANNUAL');
    });

    it('debe tener métodos de pago válidos', () => {
      const validMethods = Object.values(PAYMENT_METHODS);
      expect(validMethods).toContain('CREDIT_CARD');
      expect(validMethods).toContain('DEBIT_CARD');
      expect(validMethods).toContain('BANK_TRANSFER');
      expect(validMethods).toContain('CASH');
    });

    it('debe tener tipos de documento válidos', () => {
      const validTypes = Object.values(CONTRACT_DOCUMENT_TYPES);
      expect(validTypes).toContain('CONTRACT');
      expect(validTypes).toContain('POLICY');
      expect(validTypes).toContain('RECEIPT');
      expect(validTypes).toContain('CLAIM');
      expect(validTypes).toContain('OTHER');
    });
  });
}); 