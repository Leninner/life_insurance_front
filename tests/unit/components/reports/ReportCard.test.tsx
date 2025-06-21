import { render, screen } from '@testing-library/react'
import { ReportCard } from '@/components/reports/ReportCard'

describe('ReportCard', () => {
  const defaultProps = {
    title: 'Reporte de Ventas',
    description: 'Análisis detallado de ventas mensuales',
    href: '/reports/sales',
  }

  it('renders with correct title and description', () => {
    render(<ReportCard {...defaultProps} />)
    
    expect(screen.getByText('Reporte de Ventas')).toBeInTheDocument()
    expect(screen.getByText('Análisis detallado de ventas mensuales')).toBeInTheDocument()
  })

  it('renders with correct link href', () => {
    render(<ReportCard {...defaultProps} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/reports/sales')
  })

  it('applies correct styling to the card', () => {
    render(<ReportCard {...defaultProps} />)
    
    const card = screen.getByRole('link').firstChild
    expect(card).toHaveClass('bg-white')
    expect(card).toHaveClass('rounded-lg')
    expect(card).toHaveClass('shadow')
    expect(card).toHaveClass('p-6')
    expect(card).toHaveClass('hover:shadow-md')
    expect(card).toHaveClass('transition-shadow')
    expect(card).toHaveClass('cursor-pointer')
  })

  it('applies correct styling to the title', () => {
    render(<ReportCard {...defaultProps} />)
    
    const title = screen.getByText('Reporte de Ventas')
    expect(title).toHaveClass('text-lg')
    expect(title).toHaveClass('font-semibold')
    expect(title).toHaveClass('mb-4')
  })

  it('applies correct styling to the description', () => {
    render(<ReportCard {...defaultProps} />)
    
    const description = screen.getByText('Análisis detallado de ventas mensuales')
    expect(description).toHaveClass('text-gray-600')
  })

  it('renders with different props', () => {
    const customProps = {
      title: 'Reporte de Clientes',
      description: 'Estadísticas de clientes activos',
      href: '/reports/customers',
    }

    render(<ReportCard {...customProps} />)
    
    expect(screen.getByText('Reporte de Clientes')).toBeInTheDocument()
    expect(screen.getByText('Estadísticas de clientes activos')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/reports/customers')
  })
}) 