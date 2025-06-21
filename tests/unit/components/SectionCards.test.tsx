import { render, screen } from '@testing-library/react'
import { SectionCards } from '@/components/section-cards'

describe('SectionCards', () => {
  it('renders all four cards with correct titles', () => {
    render(<SectionCards />)
    
    // Verificar que los títulos de las tarjetas estén presentes
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('New Customers')).toBeInTheDocument()
    expect(screen.getByText('Active Accounts')).toBeInTheDocument()
    expect(screen.getByText('Growth Rate')).toBeInTheDocument()
  })

  it('displays correct values in each card', () => {
    render(<SectionCards />)
    
    // Verificar los valores numéricos
    expect(screen.getByText('$1,250.00')).toBeInTheDocument()
    expect(screen.getByText('1,234')).toBeInTheDocument()
    expect(screen.getByText('45,678')).toBeInTheDocument()
    expect(screen.getByText('4.5%')).toBeInTheDocument()
  })

  it('shows correct trend indicators', () => {
    render(<SectionCards />)
    
    // Verificar los indicadores de tendencia
    expect(screen.getAllByText('+12.5%')).toHaveLength(2)
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByText('+4.5%')).toBeInTheDocument()
  })

  it('displays correct descriptions in card footers', () => {
    render(<SectionCards />)
    
    // Verificar las descripciones en los pies de las tarjetas
    expect(screen.getByText('Visitors for the last 6 months')).toBeInTheDocument()
    expect(screen.getByText('Acquisition needs attention')).toBeInTheDocument()
    expect(screen.getByText('Engagement exceed targets')).toBeInTheDocument()
    expect(screen.getByText('Meets growth projections')).toBeInTheDocument()
  })
}) 