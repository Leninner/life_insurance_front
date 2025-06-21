import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/progress'

describe('Progress', () => {
  it('renders with default value', () => {
    render(<Progress />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveClass('bg-primary/20')
  })

  it('renders with specific value', () => {
    render(<Progress value={50} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' })
  })

  it('renders with value 0', () => {
    render(<Progress value={0} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('renders with value 100', () => {
    render(<Progress value={100} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    expect(indicator).toHaveStyle({ transform: 'translateX(0%)' })
  })

  it('applies custom className', () => {
    render(<Progress className="custom-class" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('custom-class')
  })

  it('handles invalid values', () => {
    render(<Progress value={-10} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    // Should clamp to 0
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
  })

  it('handles values over 100', () => {
    render(<Progress value={150} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    // Should clamp to 100
    expect(indicator).toHaveStyle({ transform: 'translateX(0%)' })
  })

  it('maintains proper dimensions', () => {
    render(<Progress />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('h-2 w-full')
  })

  it('applies proper border radius', () => {
    render(<Progress />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('rounded-full')
  })

  it('handles animation of value changes', () => {
    const { rerender } = render(<Progress value={0} />)
    
    const progress = screen.getByRole('progressbar')
    const indicator = progress.querySelector('[data-slot="progress-indicator"]')
    
    expect(indicator).toHaveStyle({ transform: 'translateX(-100%)' })
    
    rerender(<Progress value={50} />)
    expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' })
    
    rerender(<Progress value={100} />)
    expect(indicator).toHaveStyle({ transform: 'translateX(0%)' })
  })
}) 