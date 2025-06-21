import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

describe('Alert', () => {
  it('renders with default variant', () => {
    render(
      <Alert>
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is a default alert message.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('bg-card')
    expect(screen.getByText('Default Alert')).toBeInTheDocument()
    expect(screen.getByText('This is a default alert message.')).toBeInTheDocument()
  })

  it('renders with destructive variant', () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is a destructive alert message.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('text-destructive')
    expect(screen.getByText('Destructive Alert')).toBeInTheDocument()
    expect(screen.getByText('This is a destructive alert message.')).toBeInTheDocument()
  })

  it('renders with icon', () => {
    render(
      <Alert>
        <AlertCircle />
        <AlertTitle>Alert with Icon</AlertTitle>
        <AlertDescription>This alert has an icon.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]')
    expect(alert.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom className to Alert', () => {
    render(
      <Alert className="custom-class">
        <AlertTitle>Custom Alert</AlertTitle>
        <AlertDescription>This alert has a custom class.</AlertDescription>
      </Alert>
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('custom-class')
  })

  it('applies custom className to AlertTitle', () => {
    render(
      <Alert>
        <AlertTitle className="custom-title">Custom Title</AlertTitle>
        <AlertDescription>This alert has a custom title class.</AlertDescription>
      </Alert>
    )

    const title = screen.getByText('Custom Title')
    expect(title).toHaveClass('custom-title')
  })

  it('applies custom className to AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription className="custom-description">
          This alert has a custom description class.
        </AlertDescription>
      </Alert>
    )

    const description = screen.getByText('This alert has a custom description class.')
    expect(description).toHaveClass('custom-description')
  })

  it('handles long content with line clamping', () => {
    const longTitle = 'This is a very long title that should be clamped to one line and not overflow the container'
    render(
      <Alert>
        <AlertTitle>{longTitle}</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    )

    const title = screen.getByText(longTitle)
    expect(title).toHaveClass('line-clamp-1')
  })

  it('maintains proper grid layout with and without icon', () => {
    const { rerender } = render(
      <Alert>
        <AlertTitle>Without Icon</AlertTitle>
        <AlertDescription>This alert has no icon.</AlertDescription>
      </Alert>
    )

    let alert = screen.getByRole('alert')
    expect(alert).toHaveClass('grid-cols-[0_1fr]')

    rerender(
      <Alert>
        <AlertCircle />
        <AlertTitle>With Icon</AlertTitle>
        <AlertDescription>This alert has an icon.</AlertDescription>
      </Alert>
    )

    alert = screen.getByRole('alert')
    expect(alert).toHaveClass('has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr]')
  })
}) 