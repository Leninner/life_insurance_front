import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

describe('Dialog', () => {
  const TestDialog = () => {
    return (
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Title</DialogTitle>
            <DialogDescription>Test Description</DialogDescription>
          </DialogHeader>
          <div>Dialog Content</div>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  it('renders trigger button', () => {
    render(<TestDialog />)
    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
  })

  it('opens dialog when trigger is clicked', async () => {
    render(<TestDialog />)
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Dialog Content')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-close')).toBeInTheDocument()
    })
  })

  it('closes dialog when close button is clicked', async () => {
    render(<TestDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Click close button
    const closeButton = screen.getByTestId('dialog-close')
    await userEvent.click(closeButton)
    
    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    })
  })

  it('closes dialog when X button is clicked', async () => {
    render(<TestDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Click X button (el segundo botón con nombre Close)
    const buttons = screen.getAllByRole('button', { name: /close/i })
    const xButton = buttons[1] // El primero es el del pie, el segundo es la X
    await userEvent.click(xButton)
    
    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    })
  })

  it('applies custom className to content', async () => {
    const TestDialogWithCustomClass = () => {
      return (
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="custom-class">
            <DialogHeader>
              <DialogTitle>Test Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
    }

    render(<TestDialogWithCustomClass />)
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    await waitFor(() => {
      const content = screen.getByTestId('dialog-content')
      expect(content).toHaveClass('custom-class')
    })
  })

  it('handles keyboard navigation', async () => {
    render(<TestDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Press Escape to close
    await userEvent.keyboard('{Escape}')
    
    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    })
  })

  it('renders in non-modal mode when specified', async () => {
    const TestNonModalDialog = () => {
      return (
        <Dialog modal={false}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Test Title</DialogTitle>
          </DialogContent>
        </Dialog>
      )
    }

    render(<TestNonModalDialog />)
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Dialog should be open but not modal
    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      // User should be able to interact with elements outside the dialog
      expect(document.body).not.toHaveAttribute('aria-hidden')
    })
  })
}) 