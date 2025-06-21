import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { ContractStatus, PaymentFrequency } from '@/modules/contracts/contract.interfaces'
import { insurancesHandlers } from './handlers/insurances'
import { clientsHandlers } from './handlers/clients'

interface Beneficiary {
  id: string
  firstName: string
  lastName: string
  percentage: number
  contactInfo: string
  relationship: string
}

interface Contract {
  id: string
  contractNumber: string
  name: string
  status: ContractStatus
  paymentFrequency: PaymentFrequency
  startDate: string
  endDate: string
  totalAmount: number
  installmentAmount: number
  insurance: {
    id: string
    name: string
  }
  client: {
    id: string
    name: string
  }
  beneficiaries: Beneficiary[]
  attachments: any[]
}

// Datos mock para las pruebas
const mockContracts = [
  {
    id: 1,
    clientId: 1,
    insuranceId: 1,
    status: ContractStatus.ACTIVE,
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    premium: 50,
    paymentFrequency: PaymentFrequency.MONTHLY,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    clientId: 2,
    insuranceId: 2,
    status: ContractStatus.DRAFT,
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    premium: 200,
    paymentFrequency: PaymentFrequency.MONTHLY,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// Configurar los handlers para las rutas de la API
const contractHandlers = [
  // Obtener lista de contratos
  http.get('/api/contracts', () => {
    return HttpResponse.json(mockContracts)
  }),

  // Obtener un contrato específico
  http.get('/api/contracts/:id', ({ params }) => {
    const contract = mockContracts.find(c => c.id === Number(params.id))
    if (!contract) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(contract)
  }),

  // Crear un nuevo contrato
  http.post('/api/contracts', async ({ request }) => {
    const body = await request.json() as Omit<typeof mockContracts[0], 'id' | 'createdAt' | 'updatedAt'>
    const newContract = {
      id: mockContracts.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockContracts.push(newContract)
    return HttpResponse.json(newContract, { status: 201 })
  }),

  // Actualizar un contrato
  http.put('/api/contracts/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const contractIndex = mockContracts.findIndex(c => c.id === id)
    if (contractIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    const body = await request.json() as Omit<typeof mockContracts[0], 'id' | 'createdAt' | 'updatedAt'>
    const updatedContract = {
      ...mockContracts[contractIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    mockContracts[contractIndex] = updatedContract
    return HttpResponse.json(updatedContract)
  }),

  // Eliminar un contrato
  http.delete('/api/contracts/:id', ({ params }) => {
    const id = Number(params.id)
    const contractIndex = mockContracts.findIndex(c => c.id === id)
    if (contractIndex === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    mockContracts.splice(contractIndex, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  // Obtener beneficiarios de un contrato
  http.get('/api/contracts/:id/beneficiaries', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          firstName: 'Juan',
          lastName: 'Pérez',
          percentage: 50,
          contactInfo: 'juan@example.com',
          relationship: 'Hijo'
        } as Beneficiary
      ]
    })
  }),

  // Agregar un beneficiario
  http.post('/api/contracts/:id/beneficiaries', async ({ request }) => {
    const newBeneficiary = await request.json() as Partial<Beneficiary>
    return HttpResponse.json(
      {
        data: {
          id: '2',
          ...newBeneficiary
        } as Beneficiary
      },
      { status: 201 }
    )
  })
]

// Crear el servidor mock con la configuración correcta
export const server = setupServer(...insurancesHandlers, ...clientsHandlers, ...contractHandlers) 