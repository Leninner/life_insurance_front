import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { vi } from 'vitest'

describe('ToggleGroup', () => {
  const TestToggleGroup = () => {
    return (
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
        <ToggleGroupItem value="b">Option B</ToggleGroupItem>
        <ToggleGroupItem value="c">Option C</ToggleGroupItem>
      </ToggleGroup>
    )
  }

  it('renders toggle group with items', () => {
    render(<TestToggleGroup />)
    
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
    expect(screen.getByText('Option C')).toBeInTheDocument()
  })

  it('applies custom className to ToggleGroup', () => {
    render(
      <ToggleGroup type="single" className="custom-group">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveClass('custom-group')
  })

  it('applies custom className to ToggleGroupItem', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" className="custom-item">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('custom-item')
  })

  it('handles value changes', () => {
    const handleValueChange = vi.fn()
    render(
      <ToggleGroup type="single" onValueChange={handleValueChange}>
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
        <ToggleGroupItem value="b">Option B</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const optionB = screen.getByText('Option B')
    fireEvent.click(optionB)
    
    expect(handleValueChange).toHaveBeenCalledWith('b')
  })

  it('applies default variant styles', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('bg-transparent')
  })

  it('applies outline variant styles', () => {
    render(
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const group = screen.getByRole('group')
    expect(group).toHaveClass('data-[variant=outline]:shadow-xs')
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('border')
    expect(radioItem).toHaveClass('border-input')
  })

  it('applies default size styles', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('h-9')
    expect(radioItem).toHaveClass('px-2')
  })

  it('applies small size styles', () => {
    render(
      <ToggleGroup type="single" size="sm">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('h-8')
    expect(radioItem).toHaveClass('px-1.5')
  })

  it('applies large size styles', () => {
    render(
      <ToggleGroup type="single" size="lg">
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toHaveClass('h-10')
    expect(radioItem).toHaveClass('px-2.5')
  })

  it('handles disabled state', () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" disabled>Option A</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const radioItem = screen.getByRole('radio')
    expect(radioItem).toBeDisabled()
    expect(radioItem).toHaveClass('disabled:opacity-50')
  })

  it('handles multiple selection', () => {
    const handleValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" onValueChange={handleValueChange}>
        <ToggleGroupItem value="a">Option A</ToggleGroupItem>
        <ToggleGroupItem value="b">Option B</ToggleGroupItem>
      </ToggleGroup>
    )
    
    const optionA = screen.getByText('Option A')
    const optionB = screen.getByText('Option B')
    
    fireEvent.click(optionA)
    fireEvent.click(optionB)
    
    expect(handleValueChange).toHaveBeenCalledWith(['a', 'b'])
  })
}) 