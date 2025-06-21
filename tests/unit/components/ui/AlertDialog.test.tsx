import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

describe('AlertDialog', () => {
  const TestAlertDialog = () => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  it('renders trigger button', () => {
    render(<TestAlertDialog />)
    expect(screen.getByText('Open Dialog')).toBeInTheDocument()
  })

  it('opens dialog when trigger is clicked', async () => {
    render(<TestAlertDialog />)
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  it('closes dialog when cancel button is clicked', async () => {
    render(<TestAlertDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Click cancel
    const cancelButton = screen.getByText('Cancel')
    await userEvent.click(cancelButton)
    
    // Dialog should be closed
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('closes dialog when action button is clicked', async () => {
    render(<TestAlertDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Click action
    const actionButton = screen.getByText('Continue')
    await userEvent.click(actionButton)
    
    // Dialog should be closed
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('applies custom className to content', async () => {
    const TestAlertDialogWithCustomClass = () => {
      return (
        <AlertDialog>
          <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
          <AlertDialogContent className="custom-class">
            <AlertDialogHeader>
              <AlertDialogTitle>Test Title</AlertDialogTitle>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      )
    }

    render(<TestAlertDialogWithCustomClass />)
    
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    const content = screen.getByText('Test Title').closest('[data-slot="alert-dialog-content"]')
    expect(content).toHaveClass('custom-class')
  })

  it('handles keyboard navigation', async () => {
    render(<TestAlertDialog />)
    
    // Open dialog
    const trigger = screen.getByText('Open Dialog')
    await userEvent.click(trigger)
    
    // Press Escape to close
    await userEvent.keyboard('{Escape}')
    
    // Dialog should be closed
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })
}) 