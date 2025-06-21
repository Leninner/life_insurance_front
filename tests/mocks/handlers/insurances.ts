import { http, HttpResponse } from 'msw';

interface Insurance {
  id: number;
  name: string;
  description: string;
  coverage: number;
  monthlyPremium: number;
  createdAt: string;
  updatedAt: string;
}

const mockInsurances: Insurance[] = [
  {
    id: 1,
    name: 'Seguro de Vida Básico',
    description: 'Cobertura básica de seguro de vida',
    coverage: 100000,
    monthlyPremium: 50,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Seguro de Vida Premium',
    description: 'Cobertura premium de seguro de vida',
    coverage: 500000,
    monthlyPremium: 200,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const insurancesHandlers = [
  http.get('/api/insurances', () => {
    return HttpResponse.json(mockInsurances);
  }),

  http.get('/api/insurances/:id', ({ params }) => {
    const insurance = mockInsurances.find(i => i.id === Number(params.id));
    if (!insurance) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(insurance);
  }),

  http.post('/api/insurances', async ({ request }) => {
    const body = await request.json() as Omit<Insurance, 'id' | 'createdAt' | 'updatedAt'>;
    const newInsurance = {
      id: mockInsurances.length + 1,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockInsurances.push(newInsurance);
    return HttpResponse.json(newInsurance, { status: 201 });
  }),

  http.put('/api/insurances/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const insuranceIndex = mockInsurances.findIndex(i => i.id === id);
    if (insuranceIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = await request.json() as Omit<Insurance, 'id' | 'createdAt' | 'updatedAt'>;
    const updatedInsurance = {
      ...mockInsurances[insuranceIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    mockInsurances[insuranceIndex] = updatedInsurance;
    return HttpResponse.json(updatedInsurance);
  }),

  http.delete('/api/insurances/:id', ({ params }) => {
    const id = Number(params.id);
    const insuranceIndex = mockInsurances.findIndex(i => i.id === id);
    if (insuranceIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    mockInsurances.splice(insuranceIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
]; 