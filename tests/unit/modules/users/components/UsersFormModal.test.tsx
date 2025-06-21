import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UsersFormModal } from '@/modules/users/components/UsersFormModal';
import { UserRole } from '@/modules/users/users.interfaces';

describe('UsersFormModal', () => {
  const mockUser = {
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
  };

  const mockOnSubmit = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el modal correctamente', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
  });

  it('debe mostrar los valores del usuario en el formulario', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.getByLabelText(/nombre/i)).toHaveValue('John');
    expect(screen.getByLabelText(/apellido/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText(/teléfono/i)).toHaveValue('+1234567890');
    expect(screen.getByLabelText(/rol/i)).toHaveValue(UserRole.USER);
  });

  it('debe llamar a onSubmit con los datos del formulario', async () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const firstNameInput = screen.getByLabelText(/nombre/i);
    const lastNameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const roleInput = screen.getByLabelText(/rol/i);

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(emailInput, { target: { value: 'jane.smith@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '+0987654321' } });
    fireEvent.change(roleInput, { target: { value: UserRole.ADMIN } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        details: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '+0987654321',
          role: UserRole.ADMIN,
        },
      });
    });
  });

  it('debe validar los campos requeridos', async () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const firstNameInput = screen.getByLabelText(/nombre/i);
    const lastNameInput = screen.getByLabelText(/apellido/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/teléfono/i);
    const roleInput = screen.getByLabelText(/rol/i);

    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(phoneInput, { target: { value: '' } });
    fireEvent.change(roleInput, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el apellido es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el teléfono es requerido/i)).toBeInTheDocument();
      expect(screen.getByText(/el rol es requerido/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato del email', async () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el email no es válido/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe validar el formato del teléfono', async () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const phoneInput = screen.getByLabelText(/teléfono/i);
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/el teléfono no es válido/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('debe llamar a onClose al hacer clic en el botón de cancelar', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('debe llamar a onClose al hacer clic fuera del modal', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    const modal = screen.getByRole('dialog');
    fireEvent.click(modal);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('no debe mostrar el modal cuando isOpen es false', () => {
    render(
      <UsersFormModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('debe mostrar el título correcto', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
  });

  it('debe mostrar el botón de guardar', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('debe mostrar el botón de cancelar', () => {
    render(
      <UsersFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        user={mockUser}
        title="Editar Usuario"
      />
    );

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });
}); 