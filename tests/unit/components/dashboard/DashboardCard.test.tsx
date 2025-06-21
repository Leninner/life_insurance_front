import { render, screen, fireEvent } from '@testing-library/react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { vi } from 'vitest'

describe('DashboardCard', () => {
  it('renders children content', () => {
    render(
      <DashboardCard>
        <div>Test Content</div>
      </DashboardCard>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders action button when actionLabel is provided', () => {
    const mockOnAction = vi.fn()
    render(
      <DashboardCard actionLabel="Ver más" onAction={mockOnAction}>
        <div>Test Content</div>
      </DashboardCard>
    )
    
    const actionButton = screen.getByRole('button', { name: 'Ver más' })
    expect(actionButton).toBeInTheDocument()
    expect(actionButton).toHaveClass('bg-blue-600')
  })

  it('does not render action button when actionLabel is not provided', () => {
    render(
      <DashboardCard>
        <div>Test Content</div>
      </DashboardCard>
    )
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onAction when action button is clicked', () => {
    const mockOnAction = vi.fn()
    render(
      <DashboardCard actionLabel="Ver más" onAction={mockOnAction}>
        <div>Test Content</div>
      </DashboardCard>
    )
    
    const actionButton = screen.getByRole('button', { name: 'Ver más' })
    fireEvent.click(actionButton)
    
    expect(mockOnAction).toHaveBeenCalledTimes(1)
  })

  it('applies correct styling to action button', () => {
    render(
      <DashboardCard actionLabel="Ver más">
        <div>Test Content</div>
      </DashboardCard>
    )
    
    const actionButton = screen.getByRole('button', { name: 'Ver más' })
    expect(actionButton).toHaveClass('bg-blue-600')
    expect(actionButton).toHaveClass('text-white')
    expect(actionButton).toHaveClass('px-4')
    expect(actionButton).toHaveClass('py-2')
    expect(actionButton).toHaveClass('rounded')
    expect(actionButton).toHaveClass('hover:bg-blue-700')
  })
}) 