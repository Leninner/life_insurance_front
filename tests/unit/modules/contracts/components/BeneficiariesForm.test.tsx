import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BeneficiariesForm } from '@/modules/contracts/components/BeneficiariesForm';
import { contractsService } from '@/modules/contracts/contracts.service';

// Mock del servicio de contratos
vi.mock('@/modules/contracts/contracts.service', () => ({
  contractsService: {
    getBeneficiaries: vi.fn(),
    addBeneficiary: vi.fn(),
    updateBeneficiary: vi.fn(),
    deleteBeneficiary: vi.fn(),
  },
}));

describe('BeneficiariesForm', () => {
  const mockBeneficiaries = [
    {
      id: '1',
      name: 'María Pérez',
      relationship: 'HIJO',
      percentage: 100,
    },
  ];

  const mockContractId = '1';

  beforeEach(() => {
    vi.clearAllMocks();
    (contractsService.getBeneficiaries as any).mockResolvedValue({
      data: mockBeneficiaries,
    });
  });

  it('debe renderizar el formulario correctamente', async () => {
    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Beneficiarios')).toBeInTheDocument();
      expect(screen.getByText('Agregar Beneficiario')).toBeInTheDocument();
    });
  });

  it('debe mostrar la lista de beneficiarios', async () => {
    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('María Pérez')).toBeInTheDocument();
      expect(screen.getByText('HIJO')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  it('debe mostrar el formulario de agregar beneficiario', async () => {
    render(<BeneficiariesForm contractId={mockContractId} />);

    const addButton = screen.getByText('Agregar Beneficiario');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Relación')).toBeInTheDocument();
      expect(screen.getByLabelText('Porcentaje')).toBeInTheDocument();
    });
  });

  it('debe agregar un nuevo beneficiario correctamente', async () => {
    const newBeneficiary = {
      name: 'Juan Pérez',
      relationship: 'HIJO',
      percentage: 50,
    };

    (contractsService.addBeneficiary as any).mockResolvedValueOnce({
      data: { id: '2', ...newBeneficiary },
    });

    render(<BeneficiariesForm contractId={mockContractId} />);

    const addButton = screen.getByText('Agregar Beneficiario');
    fireEvent.click(addButton);

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: newBeneficiary.name },
    });
    fireEvent.change(screen.getByLabelText('Relación'), {
      target: { value: newBeneficiary.relationship },
    });
    fireEvent.change(screen.getByLabelText('Porcentaje'), {
      target: { value: newBeneficiary.percentage.toString() },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.addBeneficiary).toHaveBeenCalledWith(
        mockContractId,
        newBeneficiary
      );
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    });
  });

  it('debe validar que el porcentaje total no exceda 100%', async () => {
    render(<BeneficiariesForm contractId={mockContractId} />);

    const addButton = screen.getByText('Agregar Beneficiario');
    fireEvent.click(addButton);

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: 'Juan Pérez' },
    });
    fireEvent.change(screen.getByLabelText('Relación'), {
      target: { value: 'HIJO' },
    });
    fireEvent.change(screen.getByLabelText('Porcentaje'), {
      target: { value: '50' },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El porcentaje total no puede exceder 100%')).toBeInTheDocument();
    });
  });

  it('debe eliminar un beneficiario correctamente', async () => {
    (contractsService.deleteBeneficiary as any).mockResolvedValueOnce({});

    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Eliminar');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(contractsService.deleteBeneficiary).toHaveBeenCalledWith(
        mockContractId,
        '1'
      );
      expect(screen.queryByText('María Pérez')).not.toBeInTheDocument();
    });
  });

  it('debe actualizar un beneficiario correctamente', async () => {
    const updatedBeneficiary = {
      id: '1',
      name: 'María Pérez Actualizada',
      relationship: 'HIJO',
      percentage: 100,
    };

    (contractsService.updateBeneficiary as any).mockResolvedValueOnce({
      data: updatedBeneficiary,
    });

    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      const editButton = screen.getByText('Editar');
      fireEvent.click(editButton);
    });

    fireEvent.change(screen.getByLabelText('Nombre'), {
      target: { value: updatedBeneficiary.name },
    });

    const submitButton = screen.getByText('Guardar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contractsService.updateBeneficiary).toHaveBeenCalledWith(
        mockContractId,
        '1',
        { name: updatedBeneficiary.name }
      );
      expect(screen.getByText('María Pérez Actualizada')).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay beneficiarios', async () => {
    (contractsService.getBeneficiaries as any).mockResolvedValueOnce({
      data: [],
    });

    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('No hay beneficiarios registrados')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar beneficiarios', async () => {
    const error = new Error('Error al cargar beneficiarios');
    (contractsService.getBeneficiaries as any).mockRejectedValueOnce(error);

    render(<BeneficiariesForm contractId={mockContractId} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los beneficiarios')).toBeInTheDocument();
    });
  });
}); 