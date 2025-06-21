import { describe, it, expect } from 'vitest';
import {
  formatContractStatus,
  formatContractType,
  calculateContractDuration,
  calculateTotalPremium,
  validateContractDates,
  validateContractAmounts,
  formatCurrency,
  formatDate,
} from '@/modules/contracts/utils/contract.utils';

describe('Contract Utils', () => {
  describe('formatContractStatus', () => {
    it('debe formatear el estado ACTIVE correctamente', () => {
      expect(formatContractStatus('ACTIVE')).toBe('Activo');
    });

    it('debe formatear el estado PENDING correctamente', () => {
      expect(formatContractStatus('PENDING')).toBe('Pendiente');
    });

    it('debe formatear el estado EXPIRED correctamente', () => {
      expect(formatContractStatus('EXPIRED')).toBe('Expirado');
    });

    it('debe formatear el estado CANCELLED correctamente', () => {
      expect(formatContractStatus('CANCELLED')).toBe('Cancelado');
    });

    it('debe retornar el estado original si no es reconocido', () => {
      expect(formatContractStatus('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('formatContractType', () => {
    it('debe formatear el tipo LIFE correctamente', () => {
      expect(formatContractType('LIFE')).toBe('Vida');
    });

    it('debe formatear el tipo HEALTH correctamente', () => {
      expect(formatContractType('HEALTH')).toBe('Salud');
    });

    it('debe formatear el tipo AUTO correctamente', () => {
      expect(formatContractType('AUTO')).toBe('Auto');
    });

    it('debe formatear el tipo HOME correctamente', () => {
      expect(formatContractType('HOME')).toBe('Hogar');
    });

    it('debe retornar el tipo original si no es reconocido', () => {
      expect(formatContractType('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('calculateContractDuration', () => {
    it('debe calcular la duración correctamente', () => {
      const startDate = '2024-01-01';
      const endDate = '2025-01-01';
      expect(calculateContractDuration(startDate, endDate)).toBe(365);
    });

    it('debe retornar 0 si las fechas son inválidas', () => {
      expect(calculateContractDuration('invalid', 'invalid')).toBe(0);
    });

    it('debe retornar 0 si la fecha de inicio es posterior a la fecha de fin', () => {
      const startDate = '2025-01-01';
      const endDate = '2024-01-01';
      expect(calculateContractDuration(startDate, endDate)).toBe(0);
    });
  });

  describe('calculateTotalPremium', () => {
    it('debe calcular el total de la prima correctamente', () => {
      const premium = 1000;
      const duration = 12;
      expect(calculateTotalPremium(premium, duration)).toBe(12000);
    });

    it('debe retornar 0 si la prima es negativa', () => {
      expect(calculateTotalPremium(-1000, 12)).toBe(0);
    });

    it('debe retornar 0 si la duración es negativa', () => {
      expect(calculateTotalPremium(1000, -12)).toBe(0);
    });
  });

  describe('validateContractDates', () => {
    it('debe validar fechas correctas', () => {
      const startDate = '2024-01-01';
      const endDate = '2025-01-01';
      expect(validateContractDates(startDate, endDate)).toBe(true);
    });

    it('debe rechazar fechas inválidas', () => {
      expect(validateContractDates('invalid', 'invalid')).toBe(false);
    });

    it('debe rechazar si la fecha de inicio es posterior a la fecha de fin', () => {
      const startDate = '2025-01-01';
      const endDate = '2024-01-01';
      expect(validateContractDates(startDate, endDate)).toBe(false);
    });

    it('debe rechazar si la fecha de inicio es en el pasado', () => {
      const startDate = '2020-01-01';
      const endDate = '2025-01-01';
      expect(validateContractDates(startDate, endDate)).toBe(false);
    });
  });

  describe('validateContractAmounts', () => {
    it('debe validar montos correctos', () => {
      const premium = 1000;
      const coverage = 100000;
      expect(validateContractAmounts(premium, coverage)).toBe(true);
    });

    it('debe rechazar prima negativa', () => {
      expect(validateContractAmounts(-1000, 100000)).toBe(false);
    });

    it('debe rechazar cobertura negativa', () => {
      expect(validateContractAmounts(1000, -100000)).toBe(false);
    });

    it('debe rechazar si la prima es mayor que la cobertura', () => {
      expect(validateContractAmounts(1000000, 100000)).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('debe formatear moneda correctamente', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
    });

    it('debe formatear números negativos correctamente', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000.00');
    });

    it('debe formatear cero correctamente', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('debe formatear números decimales correctamente', () => {
      expect(formatCurrency(1000.5)).toBe('$1,000.50');
    });
  });

  describe('formatDate', () => {
    it('debe formatear fecha correctamente', () => {
      expect(formatDate('2024-01-01')).toBe('01/01/2024');
    });

    it('debe manejar fechas inválidas', () => {
      expect(formatDate('invalid')).toBe('Fecha inválida');
    });

    it('debe formatear fecha con hora correctamente', () => {
      expect(formatDate('2024-01-01T10:00:00Z')).toBe('01/01/2024 10:00');
    });
  });
}); 