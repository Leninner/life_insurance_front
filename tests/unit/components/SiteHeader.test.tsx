import { render, screen } from '@testing-library/react'
import { SiteHeader } from '@/components/site-header'
import { usePathname } from 'next/navigation'
import { Mock, vi } from 'vitest'
import { SidebarProvider } from '@/components/ui/sidebar'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn()
}))

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

describe('SiteHeader', () => {
  const mockUsePathname = usePathname as Mock

  beforeEach(() => {
    mockUsePathname.mockReset()
  })

  it('renders header with dashboard title when pathname is empty', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders header with dashboard title when pathname is /dashboard', () => {
    mockUsePathname.mockReturnValue('/dashboard')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('renders header with profile title when pathname is /profile', () => {
    mockUsePathname.mockReturnValue('/profile')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument()
  })

  it('renders header with formatted title for other paths', () => {
    mockUsePathname.mockReturnValue('/user-settings')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    expect(screen.getByText('User Settings')).toBeInTheDocument()
  })

  it('renders sidebar trigger', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveClass('-ml-1')
  })

  it('renders profile link with icon and text', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    const profileLink = screen.getByRole('link', { name: /perfil/i })
    expect(profileLink).toHaveAttribute('href', '/profile')
    
    // Verificar que el ícono está presente
    const icon = profileLink.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('applies correct header styles', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('flex')
    expect(header).toHaveClass('h-(--header-height)')
    expect(header).toHaveClass('border-b')
  })

  it('applies correct button styles', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    const button = screen.getByTestId('sidebar-trigger')
    expect(button).toHaveClass('size-7')
    expect(button).toHaveClass('-ml-1')
  })

  it('handles responsive text visibility', () => {
    mockUsePathname.mockReturnValue('')
    render(
      <SidebarProvider>
        <SiteHeader />
      </SidebarProvider>
    )
    
    const profileText = screen.getByText('Perfil')
    expect(profileText).toHaveClass('hidden')
    expect(profileText).toHaveClass('sm:inline')
  })
}) 