import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  it('renders correctly with default props', () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-input')
  })

  it('handles text input', async () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText('Enter text')
    
    await userEvent.type(textarea, 'Hello World')
    expect(textarea).toHaveValue('Hello World')
  })

  it('can be disabled', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)
    const textarea = screen.getByPlaceholderText('Disabled textarea')
    
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:opacity-50')
  })

  it('renders with custom className', () => {
    render(<Textarea className="custom-class" placeholder="Custom textarea" />)
    expect(screen.getByPlaceholderText('Custom textarea')).toHaveClass('custom-class')
  })

  it('handles aria-invalid state', () => {
    render(<Textarea aria-invalid="true" placeholder="Invalid textarea" />)
    const textarea = screen.getByPlaceholderText('Invalid textarea')
    
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveClass('aria-invalid:ring-destructive/20')
  })

  it('handles rows and cols attributes', () => {
    render(<Textarea rows={5} cols={50} placeholder="Sized textarea" />)
    const textarea = screen.getByPlaceholderText('Sized textarea')
    
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toHaveAttribute('cols', '50')
  })

  it('handles maxLength attribute', async () => {
    render(<Textarea maxLength={10} placeholder="Limited textarea" />)
    const textarea = screen.getByPlaceholderText('Limited textarea')
    
    await userEvent.type(textarea, 'This is a very long text that should be limited')
    expect(textarea).toHaveValue('This is a ')
  })

  it('handles required attribute', () => {
    render(<Textarea required placeholder="Required textarea" />)
    const textarea = screen.getByPlaceholderText('Required textarea')
    
    expect(textarea).toBeRequired()
  })

  it('handles readOnly attribute', () => {
    render(<Textarea readOnly placeholder="Readonly textarea" />)
    const textarea = screen.getByPlaceholderText('Readonly textarea')
    
    expect(textarea).toHaveAttribute('readonly')
  })
}) 