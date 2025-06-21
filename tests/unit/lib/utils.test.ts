import { describe, it, expect } from 'vitest';
import { cn, formatCurrency } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('debe combinar clases de Tailwind correctamente', () => {
      const result = cn('px-4 py-2', 'bg-blue-500', 'text-white');
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white');
    });

    it('debe manejar clases condicionales', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('debe manejar clases falsas', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class');
    });

    it('debe manejar múltiples clases condicionales', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );
      expect(result).toBe('base-class active-class');
    });
  });

  describe('formatCurrency', () => {
    it('debe formatear números positivos correctamente', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('debe formatear números negativos correctamente', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
      expect(formatCurrency(-1000000)).toBe('-$1,000,000.00');
    });

    it('debe manejar números con muchos decimales', () => {
      expect(formatCurrency(1234.5678)).toBe('$1,234.57');
      expect(formatCurrency(1234.5612)).toBe('$1,234.56');
    });

    it('debe manejar números muy grandes', () => {
      expect(formatCurrency(1234567890.12)).toBe('$1,234,567,890.12');
    });
  });
}); 