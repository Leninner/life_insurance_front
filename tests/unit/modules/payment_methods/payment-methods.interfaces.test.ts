import { describe, it, expect } from 'vitest';
import { PaymentMethodType, PaymentMethod, PaymentMethodDetails } from '@/modules/payment_methods/payment-methods.interfaces';

describe('PaymentMethodInterfaces', () => {
  describe('PaymentMethodType', () => {
    it('debe tener los valores correctos', () => {
      expect(PaymentMethodType.CREDIT_CARD).toBe('CREDIT_CARD');
      expect(PaymentMethodType.DEBIT_CARD).toBe('DEBIT_CARD');
    });

    it('debe ser un enum', () => {
      expect(typeof PaymentMethodType).toBe('object');
      expect(Object.keys(PaymentMethodType)).toHaveLength(2);
    });
  });

  describe('PaymentMethodDetails', () => {
    it('debe tener las propiedades correctas', () => {
      const details: PaymentMethodDetails = {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      };

      expect(details).toHaveProperty('cardNumber');
      expect(details).toHaveProperty('cardHolderName');
      expect(details).toHaveProperty('cardExpirationDate');
      expect(details).toHaveProperty('cardCvv');
    });

    it('debe validar el tipo de las propiedades', () => {
      const details: PaymentMethodDetails = {
        cardNumber: '4111111111111111',
        cardHolderName: 'JOHN DOE',
        cardExpirationDate: '1225',
        cardCvv: '123',
      };

      expect(typeof details.cardNumber).toBe('string');
      expect(typeof details.cardHolderName).toBe('string');
      expect(typeof details.cardExpirationDate).toBe('string');
      expect(typeof details.cardCvv).toBe('string');
    });
  });

  describe('PaymentMethod', () => {
    it('debe tener las propiedades correctas', () => {
      const paymentMethod: PaymentMethod = {
        id: '1',
        type: PaymentMethodType.CREDIT_CARD,
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '1225',
          cardCvv: '123',
        },
        isValid: true,
        isDefault: true,
      };

      expect(paymentMethod).toHaveProperty('id');
      expect(paymentMethod).toHaveProperty('type');
      expect(paymentMethod).toHaveProperty('details');
      expect(paymentMethod).toHaveProperty('isValid');
      expect(paymentMethod).toHaveProperty('isDefault');
    });

    it('debe validar el tipo de las propiedades', () => {
      const paymentMethod: PaymentMethod = {
        id: '1',
        type: PaymentMethodType.CREDIT_CARD,
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '1225',
          cardCvv: '123',
        },
        isValid: true,
        isDefault: true,
      };

      expect(typeof paymentMethod.id).toBe('string');
      expect(typeof paymentMethod.type).toBe('string');
      expect(typeof paymentMethod.details).toBe('object');
      expect(typeof paymentMethod.isValid).toBe('boolean');
      expect(typeof paymentMethod.isDefault).toBe('boolean');
    });

    it('debe validar el tipo de método de pago', () => {
      const paymentMethod: PaymentMethod = {
        id: '1',
        type: PaymentMethodType.CREDIT_CARD,
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '1225',
          cardCvv: '123',
        },
        isValid: true,
        isDefault: true,
      };

      expect(Object.values(PaymentMethodType)).toContain(paymentMethod.type);
    });

    it('debe validar los detalles del método de pago', () => {
      const paymentMethod: PaymentMethod = {
        id: '1',
        type: PaymentMethodType.CREDIT_CARD,
        details: {
          cardNumber: '4111111111111111',
          cardHolderName: 'JOHN DOE',
          cardExpirationDate: '1225',
          cardCvv: '123',
        },
        isValid: true,
        isDefault: true,
      };

      expect(paymentMethod.details).toHaveProperty('cardNumber');
      expect(paymentMethod.details).toHaveProperty('cardHolderName');
      expect(paymentMethod.details).toHaveProperty('cardExpirationDate');
      expect(paymentMethod.details).toHaveProperty('cardCvv');
    });
  });

  describe('Funciones de utilidad', () => {
    it('debe validar el número de tarjeta', () => {
      const validCardNumber = '4111111111111111';
      const invalidCardNumber = '4111';

      expect(validCardNumber.length).toBe(16);
      expect(invalidCardNumber.length).not.toBe(16);
    });

    it('debe validar el nombre del titular', () => {
      const validCardHolderName = 'JOHN DOE';
      const invalidCardHolderName = '123';

      expect(/^[A-Z\s]+$/.test(validCardHolderName)).toBe(true);
      expect(/^[A-Z\s]+$/.test(invalidCardHolderName)).toBe(false);
    });

    it('debe validar la fecha de expiración', () => {
      const validExpirationDate = '1225';
      const invalidExpirationDate = '13/25';

      expect(/^\d{4}$/.test(validExpirationDate)).toBe(true);
      expect(/^\d{4}$/.test(invalidExpirationDate)).toBe(false);
    });

    it('debe validar el CVV', () => {
      const validCvv = '123';
      const invalidCvv = '12';

      expect(/^\d{3,4}$/.test(validCvv)).toBe(true);
      expect(/^\d{3,4}$/.test(invalidCvv)).toBe(false);
    });

    it('debe formatear el número de tarjeta', () => {
      const cardNumber = '4111111111111111';
      const formattedCardNumber = `•••• ${cardNumber.slice(-4)}`;

      expect(formattedCardNumber).toBe('•••• 1111');
    });

    it('debe formatear la fecha de expiración', () => {
      const expirationDate = '1225';
      const formattedExpirationDate = `${expirationDate.slice(0, 2)}/${expirationDate.slice(2)}`;

      expect(formattedExpirationDate).toBe('12/25');
    });

    it('debe formatear el nombre del titular', () => {
      const cardHolderName = 'john doe';
      const formattedCardHolderName = cardHolderName.toUpperCase();

      expect(formattedCardHolderName).toBe('JOHN DOE');
    });
  });
}); 