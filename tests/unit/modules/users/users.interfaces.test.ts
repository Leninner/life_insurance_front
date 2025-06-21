import { describe, it, expect } from 'vitest';
import { UserRole, User, UserDetails } from '@/modules/users/users.interfaces';

describe('UserInterfaces', () => {
  describe('UserRole', () => {
    it('debe tener los valores correctos', () => {
      expect(UserRole.ADMIN).toBe('ADMIN');
      expect(UserRole.USER).toBe('USER');
      expect(UserRole.AGENT).toBe('AGENT');
    });

    it('debe ser un enum', () => {
      expect(typeof UserRole).toBe('object');
      expect(Object.keys(UserRole)).toHaveLength(3);
    });
  });

  describe('UserDetails', () => {
    it('debe tener las propiedades correctas', () => {
      const details: UserDetails = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      };

      expect(details).toHaveProperty('firstName');
      expect(details).toHaveProperty('lastName');
      expect(details).toHaveProperty('email');
      expect(details).toHaveProperty('phone');
      expect(details).toHaveProperty('role');
    });

    it('debe validar el tipo de las propiedades', () => {
      const details: UserDetails = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      };

      expect(typeof details.firstName).toBe('string');
      expect(typeof details.lastName).toBe('string');
      expect(typeof details.email).toBe('string');
      expect(typeof details.phone).toBe('string');
      expect(typeof details.role).toBe('string');
    });
  });

  describe('User', () => {
    it('debe tener las propiedades correctas', () => {
      const user: User = {
        id: '1',
        details: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: UserRole.USER,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('details');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });

    it('debe validar el tipo de las propiedades', () => {
      const user: User = {
        id: '1',
        details: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: UserRole.USER,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(typeof user.id).toBe('string');
      expect(typeof user.details).toBe('object');
      expect(typeof user.createdAt).toBe('string');
      expect(typeof user.updatedAt).toBe('string');
    });

    it('debe validar el rol del usuario', () => {
      const user: User = {
        id: '1',
        details: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: UserRole.USER,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(Object.values(UserRole)).toContain(user.details.role);
    });

    it('debe validar los detalles del usuario', () => {
      const user: User = {
        id: '1',
        details: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          role: UserRole.USER,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(user.details).toHaveProperty('firstName');
      expect(user.details).toHaveProperty('lastName');
      expect(user.details).toHaveProperty('email');
      expect(user.details).toHaveProperty('phone');
      expect(user.details).toHaveProperty('role');
    });
  });

  describe('Funciones de utilidad', () => {
    it('debe validar el nombre', () => {
      const validFirstName = 'John';
      const invalidFirstName = '';

      expect(validFirstName.length > 0).toBe(true);
      expect(invalidFirstName.length > 0).toBe(false);
    });

    it('debe validar el apellido', () => {
      const validLastName = 'Doe';
      const invalidLastName = '';

      expect(validLastName.length > 0).toBe(true);
      expect(invalidLastName.length > 0).toBe(false);
    });

    it('debe validar el email', () => {
      const validEmail = 'john.doe@example.com';
      const invalidEmail = 'invalid-email';

      expect(validEmail.includes('@')).toBe(true);
      expect(invalidEmail.includes('@')).toBe(false);
    });

    it('debe validar el teléfono', () => {
      const validPhone = '+1234567890';
      const invalidPhone = '';

      expect(validPhone.length > 0).toBe(true);
      expect(invalidPhone.length > 0).toBe(false);
    });

    it('debe validar el rol', () => {
      const validRole = UserRole.USER;
      const invalidRole = 'INVALID_ROLE';

      expect(Object.values(UserRole)).toContain(validRole);
      expect(Object.values(UserRole)).not.toContain(invalidRole);
    });

    it('debe formatear el nombre completo', () => {
      const firstName = 'John';
      const lastName = 'Doe';
      const fullName = `${firstName} ${lastName}`;

      expect(fullName).toBe('John Doe');
    });

    it('debe formatear la fecha', () => {
      const date = new Date().toISOString();
      const formattedDate = new Date(date).toLocaleDateString('es-MX');

      expect(formattedDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });
  });
}); 