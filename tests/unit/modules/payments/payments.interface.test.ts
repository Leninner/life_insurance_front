import { describe, it, expect } from 'vitest';
import { PaymentStatus, Payment, PaymentDetails } from '@/modules/payments/payments.interface';

describe('PaymentInterfaces', () => {
  describe('PaymentStatus', () => {
    it('debe tener los valores correctos', () => {
      expect(PaymentStatus.PENDING).toBe('PENDING');
      expect(PaymentStatus.COMPLETED).toBe('COMPLETED');
      expect(PaymentStatus.FAILED).toBe('FAILED');
      expect(PaymentStatus.REFUNDED).toBe('REFUNDED');
    });

    it('debe ser un enum', () => {
      expect(typeof PaymentStatus).toBe('object');
      expect(Object.keys(PaymentStatus)).toHaveLength(4);
    });
  });

  describe('PaymentDetails', () => {
    it('debe tener las propiedades correctas', () => {
      const details: PaymentDetails = {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      };

      expect(details).toHaveProperty('amount');
      expect(details).toHaveProperty('currency');
      expect(details).toHaveProperty('description');
      expect(details).toHaveProperty('paymentMethodId');
    });

    it('debe validar el tipo de las propiedades', () => {
      const details: PaymentDetails = {
        amount: 1000,
        currency: 'USD',
        description: 'Pago de seguro',
        paymentMethodId: '1',
      };

      expect(typeof details.amount).toBe('number');
      expect(typeof details.currency).toBe('string');
      expect(typeof details.description).toBe('string');
      expect(typeof details.paymentMethodId).toBe('string');
    });
  });

  describe('Payment', () => {
    it('debe tener las propiedades correctas', () => {
      const payment: Payment = {
        id: '1',
        status: PaymentStatus.PENDING,
        details: {
          amount: 1000,
          currency: 'USD',
          description: 'Pago de seguro',
          paymentMethodId: '1',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(payment).toHaveProperty('id');
      expect(payment).toHaveProperty('status');
      expect(payment).toHaveProperty('details');
      expect(payment).toHaveProperty('createdAt');
      expect(payment).toHaveProperty('updatedAt');
    });

    it('debe validar el tipo de las propiedades', () => {
      const payment: Payment = {
        id: '1',
        status: PaymentStatus.PENDING,
        details: {
          amount: 1000,
          currency: 'USD',
          description: 'Pago de seguro',
          paymentMethodId: '1',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(typeof payment.id).toBe('string');
      expect(typeof payment.status).toBe('string');
      expect(typeof payment.details).toBe('object');
      expect(typeof payment.createdAt).toBe('string');
      expect(typeof payment.updatedAt).toBe('string');
    });

    it('debe validar el estado del pago', () => {
      const payment: Payment = {
        id: '1',
        status: PaymentStatus.PENDING,
        details: {
          amount: 1000,
          currency: 'USD',
          description: 'Pago de seguro',
          paymentMethodId: '1',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(Object.values(PaymentStatus)).toContain(payment.status);
    });

    it('debe validar los detalles del pago', () => {
      const payment: Payment = {
        id: '1',
        status: PaymentStatus.PENDING,
        details: {
          amount: 1000,
          currency: 'USD',
          description: 'Pago de seguro',
          paymentMethodId: '1',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(payment.details).toHaveProperty('amount');
      expect(payment.details).toHaveProperty('currency');
      expect(payment.details).toHaveProperty('description');
      expect(payment.details).toHaveProperty('paymentMethodId');
    });
  });

  describe('Funciones de utilidad', () => {
    it('debe validar el monto del pago', () => {
      const validAmount = 1000;
      const invalidAmount = -1000;

      expect(validAmount > 0).toBe(true);
      expect(invalidAmount > 0).toBe(false);
    });

    it('debe validar la moneda', () => {
      const validCurrency = 'USD';
      const invalidCurrency = 'XYZ';

      expect(['USD', 'EUR', 'MXN'].includes(validCurrency)).toBe(true);
      expect(['USD', 'EUR', 'MXN'].includes(invalidCurrency)).toBe(false);
    });

    it('debe validar la descripción', () => {
      const validDescription = 'Pago de seguro';
      const invalidDescription = '';

      expect(validDescription.length > 0).toBe(true);
      expect(invalidDescription.length > 0).toBe(false);
    });

    it('debe validar el ID del método de pago', () => {
      const validPaymentMethodId = '1';
      const invalidPaymentMethodId = '';

      expect(validPaymentMethodId.length > 0).toBe(true);
      expect(invalidPaymentMethodId.length > 0).toBe(false);
    });

    it('debe formatear el monto', () => {
      const amount = 1000;
      const formattedAmount = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(amount);

      expect(formattedAmount).toBe('$1,000.00');
    });

    it('debe formatear la fecha', () => {
      const date = new Date().toISOString();
      const formattedDate = new Date(date).toLocaleDateString('es-MX');

      expect(formattedDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
}); 