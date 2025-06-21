import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usersService } from '@/modules/users/users.service';
import { api } from '@/lib/api';
import { UserRole } from '@/modules/users/users.interfaces';

// Mock de la API
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('usersService', () => {
  const mockUser = {
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe obtener todos los usuarios', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockUser],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    });

    const result = await usersService.getUsers();

    expect(api.get).toHaveBeenCalledWith('/users', { params: undefined });
    expect(result).toEqual({
      data: [mockUser],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });
  });

  it('debe obtener todos los usuarios con parámetros de consulta', async () => {
    const params = { page: 2, limit: 20 };
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: [mockUser],
        meta: {
          total: 1,
          page: 2,
          limit: 20,
        },
      },
    });

    const result = await usersService.getUsers(params);

    expect(api.get).toHaveBeenCalledWith('/users', { params });
    expect(result).toEqual({
      data: [mockUser],
      meta: {
        total: 1,
        page: 2,
        limit: 20,
      },
    });
  });

  it('debe obtener un usuario por ID', async () => {
    (api.get as any).mockResolvedValueOnce({
      data: {
        data: mockUser,
      },
    });

    const result = await usersService.getUser('1');

    expect(api.get).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(mockUser);
  });

  it('debe crear un nuevo usuario', async () => {
    const newUser = {
      details: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      },
    };

    (api.post as any).mockResolvedValueOnce({
      data: {
        data: { ...newUser, id: '2' },
      },
    });

    const result = await usersService.createUser(newUser);

    expect(api.post).toHaveBeenCalledWith('/users', newUser);
    expect(result).toEqual({ ...newUser, id: '2' });
  });

  it('debe actualizar un usuario existente', async () => {
    const updatedUser = {
      details: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    };

    (api.put as any).mockResolvedValueOnce({
      data: {
        data: { ...mockUser, ...updatedUser },
      },
    });

    const result = await usersService.updateUser('1', updatedUser);

    expect(api.put).toHaveBeenCalledWith('/users/1', updatedUser);
    expect(result).toEqual({ ...mockUser, ...updatedUser });
  });

  it('debe eliminar un usuario', async () => {
    (api.delete as any).mockResolvedValueOnce({
      data: { success: true },
    });

    await usersService.deleteUser('1');

    expect(api.delete).toHaveBeenCalledWith('/users/1');
  });

  it('debe manejar errores al obtener usuarios', async () => {
    const error = new Error('Error al obtener usuarios');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(usersService.getUsers()).rejects.toThrow('Error al obtener usuarios');
  });

  it('debe manejar errores al obtener un usuario', async () => {
    const error = new Error('Error al obtener usuario');
    (api.get as any).mockRejectedValueOnce(error);

    await expect(usersService.getUser('1')).rejects.toThrow('Error al obtener usuario');
  });

  it('debe manejar errores al crear un usuario', async () => {
    const error = new Error('Error al crear usuario');
    (api.post as any).mockRejectedValueOnce(error);

    const newUser = {
      details: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      },
    };

    await expect(usersService.createUser(newUser)).rejects.toThrow('Error al crear usuario');
  });

  it('debe manejar errores al actualizar un usuario', async () => {
    const error = new Error('Error al actualizar usuario');
    (api.put as any).mockRejectedValueOnce(error);

    const updatedUser = {
      details: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    };

    await expect(usersService.updateUser('1', updatedUser)).rejects.toThrow('Error al actualizar usuario');
  });

  it('debe manejar errores al eliminar un usuario', async () => {
    const error = new Error('Error al eliminar usuario');
    (api.delete as any).mockRejectedValueOnce(error);

    await expect(usersService.deleteUser('1')).rejects.toThrow('Error al eliminar usuario');
  });
}); 