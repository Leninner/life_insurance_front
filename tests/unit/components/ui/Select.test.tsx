import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Mock global para scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function() {};
// Mock hasPointerCapture
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: () => false,
  writable: true
})

describe('Select', () => {
  const renderSelect = () => {
    return render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  it('renders correctly with default props', () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent('Select an option')
  })

  it('opens dropdown when clicked', async () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    
    await userEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
      expect(screen.getByText('Orange')).toBeInTheDocument()
    })
  })

  it('selects an option when clicked', async () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    
    await userEvent.click(trigger)
    const appleOption = await screen.findByText('Apple')
    await userEvent.click(appleOption)
    
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Apple')
    })
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Small" />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'sm')

    rerender(
      <Select>
        <SelectTrigger size="default">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'default')
  })

  it('can be disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
      </Select>
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveClass('disabled:opacity-50')
  })

  it('renders with custom className', () => {
    render(
      <Select>
        <SelectTrigger className="custom-class">
          <SelectValue placeholder="Custom" />
        </SelectTrigger>
      </Select>
    )
    expect(screen.getByRole('combobox')).toHaveClass('custom-class')
  })

  it('handles aria-invalid state', () => {
    render(
      <Select>
        <SelectTrigger aria-invalid="true">
          <SelectValue placeholder="Invalid" />
        </SelectTrigger>
      </Select>
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-invalid', 'true')
    expect(trigger).toHaveClass('aria-invalid:ring-destructive/20')
  })

  it('renders with groups and labels', async () => {
    renderSelect()
    const trigger = screen.getByRole('combobox')
    
    await userEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Fruits')).toBeInTheDocument()
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Banana')).toBeInTheDocument()
      expect(screen.getByText('Orange')).toBeInTheDocument()
    })
  })
}) 