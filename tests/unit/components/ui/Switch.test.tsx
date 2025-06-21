import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'
import { vi } from 'vitest'

describe('Switch', () => {
  it('renders switch component', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Switch className="custom-switch" />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('custom-switch')
  })

  it('handles checked state', () => {
    render(<Switch defaultChecked />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeChecked()
  })

  it('handles unchecked state', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).not.toBeChecked()
  })

  it('handles state changes', () => {
    const handleCheckedChange = vi.fn()
    render(<Switch onCheckedChange={handleCheckedChange} />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.click(switchElement)
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true)
  })

  it('handles disabled state', () => {
    render(<Switch disabled />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeDisabled()
    expect(switchElement).toHaveClass('disabled:opacity-50')
  })

  it('applies checked state styles', () => {
    render(<Switch defaultChecked />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('data-[state=checked]:bg-primary')
  })

  it('applies unchecked state styles', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input')
  })

  it('applies focus styles', () => {
    render(<Switch />)
    
    const switchElement = screen.getByRole('switch')
    fireEvent.focus(switchElement)
    
    expect(switchElement).toHaveClass('focus-visible:ring-[3px]')
  })

  it('applies thumb styles', () => {
    render(<Switch />)
    
    const thumb = screen.getByRole('switch').querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toHaveClass('bg-background')
    expect(thumb).toHaveClass('rounded-full')
  })

  it('applies thumb transition styles', () => {
    render(<Switch />)
    
    const thumb = screen.getByRole('switch').querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toHaveClass('transition-transform')
    expect(thumb).toHaveClass('data-[state=checked]:translate-x-[calc(100%-2px)]')
    expect(thumb).toHaveClass('data-[state=unchecked]:translate-x-0')
  })
}) 