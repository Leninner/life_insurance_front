import { render, screen } from '@testing-library/react'
import { AuthenticatedLayout } from '@/components/layouts/AuthenticatedLayout'
import { vi } from 'vitest'

// Mock de los componentes hijos
vi.mock('@/components/app-sidebar', () => ({
  AppSidebar: () => <div data-testid="app-sidebar">App Sidebar</div>,
}))

vi.mock('@/components/site-header', () => ({
  SiteHeader: () => <div data-testid="site-header">Site Header</div>,
}))

describe('AuthenticatedLayout', () => {
  it('renders the layout with all required components', () => {
    render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    
    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('site-header')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies correct CSS variables to SidebarProvider', () => {
    const { container } = render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    
    const sidebarProvider = container.firstChild
    expect(sidebarProvider).toHaveStyle({
      '--sidebar-width': 'calc(var(--spacing) * 72)',
      '--header-height': 'calc(var(--spacing) * 12)',
    })
  })

  it('renders children in the correct container', () => {
    render(
      <AuthenticatedLayout>
        <div>Test Content</div>
      </AuthenticatedLayout>
    )
    
    const contentContainer = screen.getByText('Test Content').parentElement
    expect(contentContainer).toHaveClass('min-h-[calc(100vh-var(--header-height)-2rem)]')
  })
}) 