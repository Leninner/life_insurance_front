import { beforeAll, afterAll, afterEach } from 'vitest'
import { server } from '../mocks/server'

// Configurar el servidor mock antes de todas las pruebas
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// Limpiar todas las solicitudes después de cada prueba
afterEach(() => server.resetHandlers())

// Cerrar el servidor mock después de todas las pruebas
afterAll(() => server.close()) 