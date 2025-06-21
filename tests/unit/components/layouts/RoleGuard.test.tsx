import { render } from '@testing-library/react'
import { RoleGuard } from '@/components/layouts/RoleGuard'
import { useAuthRouting } from '@/hooks/useAuthRouting'
import { useRouter } from 'next/navigation'
import { RoleType } from '@/modules/auth/auth.interfaces'
import { vi } from 'vitest'

// Mock de los hooks
vi.mock('@/hooks/useAuthRouting')
vi.mock('next/navigation')

describe('RoleGuard', () => {
  const mockRouter = {
    replace: vi.fn(),
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useAuthRouting as jest.Mock).mockReturnValue({
      userRole: null,
      isAuthenticated: false,
      hydrated: true,
    })
  })

  it('renders children when user has allowed role', () => {
    ;(useAuthRouting as jest.Mock).mockReturnValue({
      userRole: RoleType.ADMIN,
      isAuthenticated: true,
      hydrated: true,
    })

    const { container } = render(
      <RoleGuard allowedRoles={[RoleType.ADMIN]}>
        <div>Test Content</div>
      </RoleGuard>
    )
    
    expect(container).toHaveTextContent('Test Content')
  })

  it('redirects to login when user is not authenticated', () => {
    render(
      <RoleGuard allowedRoles={[RoleType.ADMIN]}>
        <div>Test Content</div>
      </RoleGuard>
    )
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/login')
  })

  it('redirects to login when user role is not allowed', () => {
    ;(useAuthRouting as jest.Mock).mockReturnValue({
      userRole: RoleType.CLIENT,
      isAuthenticated: true,
      hydrated: true,
    })

    render(
      <RoleGuard allowedRoles={[RoleType.ADMIN]}>
        <div>Test Content</div>
      </RoleGuard>
    )
    
    expect(mockRouter.replace).toHaveBeenCalledWith('/login')
  })

  it('does not redirect when not hydrated', () => {
    ;(useAuthRouting as jest.Mock).mockReturnValue({
      userRole: RoleType.CLIENT,
      isAuthenticated: false,
      hydrated: false,
    })

    render(
      <RoleGuard allowedRoles={[RoleType.ADMIN]}>
        <div>Test Content</div>
      </RoleGuard>
    )
    
    expect(mockRouter.replace).not.toHaveBeenCalled()
  })

  it('allows multiple roles', () => {
    ;(useAuthRouting as jest.Mock).mockReturnValue({
      userRole: RoleType.AGENT,
      isAuthenticated: true,
      hydrated: true,
    })

    const { container } = render(
      <RoleGuard allowedRoles={[RoleType.ADMIN, RoleType.AGENT]}>
        <div>Test Content</div>
      </RoleGuard>
    )
    
    expect(container).toHaveTextContent('Test Content')
    expect(mockRouter.replace).not.toHaveBeenCalled()
  })
}) 