import { render, screen, fireEvent } from '@testing-library/react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { useIsMobile } from '@/hooks/use-mobile'
import { vi, beforeAll, Mock } from 'vitest'

// Mock del hook useIsMobile
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}))

// Mock para el tamaño del contenedor de Recharts
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 })
})

// Mock de recharts para evitar errores de renderizado en tests
vi.mock('recharts', () => ({
  Area: () => <div data-testid="area-chart" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart-container">{children}</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend" />,
}))

describe('ChartAreaInteractive', () => {
  beforeEach(() => {
    // Por defecto, no es móvil
    (useIsMobile as unknown as Mock).mockReturnValue(false)
  })

  it('renders the chart with correct title and description', () => {
    render(<ChartAreaInteractive />)
    
    expect(screen.getByText('Total Visitors')).toBeInTheDocument()
    expect(screen.getByText('Total for the last 3 months')).toBeInTheDocument()
  })

  it('shows toggle group on desktop view', () => {
    render(<ChartAreaInteractive />)
    // Usar getAllByText para evitar ambigüedad
    expect(screen.getAllByText('Last 3 months').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Last 30 days').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Last 7 days').length).toBeGreaterThan(0)
  })

  it('shows select dropdown on mobile view', () => {
    (useIsMobile as unknown as Mock).mockReturnValue(true)
    render(<ChartAreaInteractive />)
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    fireEvent.click(select)
    // Usar getAllByText para evitar ambigüedad
    expect(screen.getAllByText('Last 3 months').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Last 30 days').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Last 7 days').length).toBeGreaterThan(0)
  })

  it('changes time range when selecting different options', () => {
    render(<ChartAreaInteractive />)
    
    const thirtyDaysButton = screen.getByText('Last 30 days')
    fireEvent.click(thirtyDaysButton)
    
    // Verificar que el botón está seleccionado
    expect(thirtyDaysButton).toHaveAttribute('data-state', 'on')
  })

  it('initializes with 7d range on mobile', () => {
    (useIsMobile as unknown as Mock).mockReturnValue(true)
    render(<ChartAreaInteractive />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveTextContent('Last 7 days')
  })
}) 