import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersTable } from '@/modules/users/components/UsersTable';
import { UserRole } from '@/modules/users/users.interfaces';

describe('UsersTable', () => {
  const mockUsers = [
    {
      id: '1',
      details: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        role: UserRole.USER,
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      details: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        role: UserRole.ADMIN,
      },
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar la tabla correctamente', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/usuarios/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByText(/rol/i)).toBeInTheDocument();
    expect(screen.getByText(/fecha/i)).toBeInTheDocument();
    expect(screen.getByText(/acciones/i)).toBeInTheDocument();
  });

  it('debe mostrar los usuarios en la tabla', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('+0987654321')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('debe llamar a onEdit al hacer clic en el botón de editar', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('debe llamar a onDelete al hacer clic en el botón de eliminar', async () => {
    window.confirm = vi.fn(() => true);

    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('debe cancelar la eliminación al rechazar la confirmación', async () => {
    window.confirm = vi.fn(() => false);

    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('debe mostrar un mensaje cuando no hay usuarios', () => {
    render(<UsersTable users={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/no hay usuarios/i)).toBeInTheDocument();
  });

  it('debe mostrar el estado de carga', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} isLoading={true} />);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it('debe mostrar el error', () => {
    const error = 'Error al cargar los usuarios';
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('debe formatear correctamente el nombre completo', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('debe formatear correctamente la fecha', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('02/01/2024')).toBeInTheDocument();
  });

  it('debe mostrar el rol correcto', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  it('debe mostrar los botones de acción', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('debe mostrar el icono de editar', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editIcons = screen.getAllByTestId('edit-icon');
    expect(editIcons).toHaveLength(2);
  });

  it('debe mostrar el icono de eliminar', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteIcons = screen.getAllByTestId('delete-icon');
    expect(deleteIcons).toHaveLength(2);
  });

  it('debe mostrar el icono de rol', () => {
    render(<UsersTable users={mockUsers} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const roleIcons = screen.getAllByTestId('role-icon');
    expect(roleIcons).toHaveLength(2);
  });
}); 