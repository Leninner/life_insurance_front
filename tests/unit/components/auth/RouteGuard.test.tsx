import { render, screen } from '@testing-library/react'
import { RouteGuard } from '@/components/auth/RouteGuard'
import { useAuthRouting } from '@/hooks/useAuthRouting'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock del hook useAuthRouting
vi.mock('@/hooks/useAuthRouting')

describe('RouteGuard', () => {
  const mockHandleRouteAccess = vi.fn()
  const mockUseAuthRouting = useAuthRouting as unknown as ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockHandleRouteAccess.mockClear()
    mockUseAuthRouting.mockReturnValue({
      handleRouteAccess: mockHandleRouteAccess,
      hydrated: true,
      pathname: '/',
    })
  })

  it('renders children when not on dashboard', () => {
    render(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )
    
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('returns null when on dashboard path', () => {
    mockUseAuthRouting.mockReturnValue({
      handleRouteAccess: mockHandleRouteAccess,
      hydrated: true,
      pathname: '/dashboard',
    })

    const { container } = render(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )
    
    expect(container).toBeEmptyDOMElement()
  })

  it('calls handleRouteAccess when hydrated', () => {
    render(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )
    
    expect(mockHandleRouteAccess).toHaveBeenCalled()
  })

  it('does not call handleRouteAccess when not hydrated', () => {
    mockUseAuthRouting.mockReturnValue({
      handleRouteAccess: mockHandleRouteAccess,
      hydrated: false,
      pathname: '/',
    })

    render(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )
    
    expect(mockHandleRouteAccess).not.toHaveBeenCalled()
  })

  it('calls handleRouteAccess when pathname changes', () => {
    const { rerender } = render(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )

    mockUseAuthRouting.mockReturnValue({
      handleRouteAccess: mockHandleRouteAccess,
      hydrated: true,
      pathname: '/new-path',
    })

    rerender(
      <RouteGuard>
        <div>Test Content</div>
      </RouteGuard>
    )
    
    expect(mockHandleRouteAccess).toHaveBeenCalledTimes(2)
  })
}) 