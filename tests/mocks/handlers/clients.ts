import { http, HttpResponse } from 'msw';

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

const mockClients: Client[] = [
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '1234567890',
    address: 'Calle Principal 123',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: '12345',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@example.com',
    phone: '0987654321',
    address: 'Avenida Central 456',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: '54321',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const clientsHandlers = [
  http.get('/api/clients', () => {
    return HttpResponse.json(mockClients);
  }),

  http.get('/api/clients/:id', ({ params }) => {
    const client = mockClients.find(c => c.id === Number(params.id));
    if (!client) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(client);
  }),

  http.post('/api/clients', async ({ request }) => {
    const body = await request.json() as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
    const newClient = {
      id: mockClients.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return HttpResponse.json(newClient, { status: 201 });
  }),

  http.put('/api/clients/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const clientIndex = mockClients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = await request.json() as Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
    const updatedClient = {
      ...mockClients[clientIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    mockClients[clientIndex] = updatedClient;
    return HttpResponse.json(updatedClient);
  }),

  http.delete('/api/clients/:id', ({ params }) => {
    const id = Number(params.id);
    const clientIndex = mockClients.findIndex(c => c.id === id);
    if (clientIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockClients.splice(clientIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
]; 