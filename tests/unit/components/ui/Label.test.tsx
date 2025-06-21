import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  it('renders correctly with default props', () => {
    render(<Label>Test Label</Label>)
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
    expect(label).toHaveClass('text-sm')
  })

  it('renders with custom className', () => {
    render(<Label className="custom-class">Custom Label</Label>)
    expect(screen.getByText('Custom Label')).toHaveClass('custom-class')
  })

  it('renders with htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Input Label</Label>)
    const label = screen.getByText('Input Label')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('renders with required input', () => {
    render(
      <div>
        <Label htmlFor="required-input">Required Label</Label>
        <input id="required-input" required />
      </div>
    )
    const label = screen.getByText('Required Label')
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
    expect(label).toHaveAttribute('for', 'required-input')
  })

  it('renders with disabled state', () => {
    render(
      <div data-disabled="true">
        <Label>Disabled Label</Label>
      </div>
    )
    const label = screen.getByText('Disabled Label')
    expect(label).toHaveClass('group-data-[disabled=true]:opacity-50')
  })

  it('renders with peer disabled state', () => {
    render(
      <div>
        <input disabled />
        <Label>Peer Disabled Label</Label>
      </div>
    )
    const label = screen.getByText('Peer Disabled Label')
    expect(label).toHaveClass('peer-disabled:opacity-50')
  })

  it('renders with custom attributes', () => {
    render(<Label data-testid="test-label" aria-label="Test">Test Label</Label>)
    const label = screen.getByTestId('test-label')
    expect(label).toHaveAttribute('aria-label', 'Test')
  })
}) 