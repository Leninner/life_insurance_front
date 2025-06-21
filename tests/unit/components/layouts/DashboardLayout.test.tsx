import { render, screen } from '@testing-library/react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'

describe('DashboardLayout', () => {
  it('renders with default title and description', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Bienvenido a su panel de control')).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(
      <DashboardLayout title="Custom Title" description="Custom Description">
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Description')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct styling to title', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    const title = screen.getByText('Dashboard')
    expect(title).toHaveClass('text-3xl')
    expect(title).toHaveClass('font-bold')
    expect(title).toHaveClass('tracking-tight')
  })

  it('applies correct styling to description', () => {
    render(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    )
    
    const description = screen.getByText('Bienvenido a su panel de control')
    expect(description).toHaveClass('text-muted-foreground')
  })
}) 