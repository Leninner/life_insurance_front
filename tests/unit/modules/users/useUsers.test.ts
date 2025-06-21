import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUsers } from '@/modules/users/useUsers';
import { usersService } from '@/modules/users/users.service';
import { UserRole } from '@/modules/users/users.interfaces';

vi.mock('@/modules/users/users.service', () => ({
  usersService: {
    getUsers: vi.fn(),
    getUser: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

describe('useUsers', () => {
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

  it('debe cargar los usuarios correctamente', async () => {
    (usersService.getUsers as any).mockResolvedValueOnce({
      data: [mockUser],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
      },
    });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.loadUsers();
    });

    expect(result.current.users).toEqual([mockUser]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al cargar los usuarios', async () => {
    const error = new Error('Error al cargar los usuarios');
    (usersService.getUsers as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.loadUsers();
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al cargar los usuarios');
  });

  it('debe crear un usuario correctamente', async () => {
    const newUser = {
      details: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      },
    };

    (usersService.createUser as any).mockResolvedValueOnce({
      ...newUser,
      id: '2',
    });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.createUser(newUser);
    });

    expect(result.current.users).toContainEqual({
      ...newUser,
      id: '2',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al crear un usuario', async () => {
    const error = new Error('Error al crear el usuario');
    (usersService.createUser as any).mockRejectedValueOnce(error);

    const newUser = {
      details: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      },
    };

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.createUser(newUser);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al crear el usuario');
  });

  it('debe actualizar un usuario correctamente', async () => {
    const updatedUser = {
      details: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    };

    (usersService.updateUser as any).mockResolvedValueOnce({
      ...mockUser,
      ...updatedUser,
    });

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.updateUser('1', updatedUser);
    });

    expect(result.current.users).toContainEqual({
      ...mockUser,
      ...updatedUser,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al actualizar un usuario', async () => {
    const error = new Error('Error al actualizar el usuario');
    (usersService.updateUser as any).mockRejectedValueOnce(error);

    const updatedUser = {
      details: {
        firstName: 'Jane',
        lastName: 'Doe',
      },
    };

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.updateUser('1', updatedUser);
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al actualizar el usuario');
  });

  it('debe eliminar un usuario correctamente', async () => {
    (usersService.deleteUser as any).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.deleteUser('1');
    });

    expect(result.current.users).not.toContainEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debe manejar errores al eliminar un usuario', async () => {
    const error = new Error('Error al eliminar el usuario');
    (usersService.deleteUser as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useUsers());

    await act(async () => {
      await result.current.deleteUser('1');
    });

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Error al eliminar el usuario');
  });

  it('debe limpiar el error', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setError('Error de prueba');
    });

    expect(result.current.error).toBe('Error de prueba');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('debe establecer el estado de carga', () => {
    const { result } = renderHook(() => useUsers());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });
}); 