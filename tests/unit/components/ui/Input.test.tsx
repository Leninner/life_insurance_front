import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-input')
  })

  it('handles text input', async () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    
    await userEvent.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('handles password visibility toggle', async () => {
    render(<Input type="password" placeholder="Enter password" />)
    const input = screen.getByPlaceholderText('Enter password')
    const toggleButton = screen.getByRole('button')
    
    // Initially password should be hidden
    expect(input).toHaveAttribute('type', 'password')
    
    // Click to show password
    await userEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    
    // Click to hide password again
    await userEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled input" />)
    const input = screen.getByPlaceholderText('Disabled input')
    
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('renders with custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />)
    expect(screen.getByPlaceholderText('Custom input')).toHaveClass('custom-class')
  })

  it('handles aria-invalid state', () => {
    render(<Input aria-invalid="true" placeholder="Invalid input" />)
    const input = screen.getByPlaceholderText('Invalid input')
    
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveClass('aria-invalid:ring-destructive/20')
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')

    rerender(<Input type="number" placeholder="Number" />)
    expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number')

    rerender(<Input type="tel" placeholder="Phone" />)
    expect(screen.getByPlaceholderText('Phone')).toHaveAttribute('type', 'tel')
  })

  it('handles file input', () => {
    const { container } = render(<Input type="file" />)
    const input = container.querySelector('input[type="file"]')
    expect(input).toHaveClass('file:text-foreground')
  })
}) 