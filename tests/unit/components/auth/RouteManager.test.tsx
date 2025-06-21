import { render } from '@testing-library/react'
import { RouteManager } from '@/components/auth/RouteManager'
import { useAuthRouting } from '@/hooks/useAuthRouting'
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'

// Mock del hook useAuthRouting
vi.mock('@/hooks/useAuthRouting')

// Mock del componente RouteGuard
vi.mock('./RouteGuard', () => ({
  RouteGuard: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('RouteManager', () => {
  const mockUseAuthRouting = useAuthRouting as unknown as ReturnType<typeof vi.fn>
  const consoleSpy = vi.spyOn(console, 'log')

  beforeEach(() => {
    consoleSpy.mockClear()
    mockUseAuthRouting.mockReturnValue({
      userRole: null,
    })
  })

  afterAll(() => {
    consoleSpy.mockRestore()
  })

  it('renders children wrapped in RouteGuard', () => {
    const { container } = render(
      <RouteManager>
        <div>Test Content</div>
      </RouteManager>
    )
    
    expect(container).toHaveTextContent('Test Content')
  })

  it('logs user role when authenticated', () => {
    mockUseAuthRouting.mockReturnValue({
      userRole: 'ADMIN',
    })

    render(
      <RouteManager>
        <div>Test Content</div>
      </RouteManager>
    )
    
    expect(consoleSpy).toHaveBeenCalledWith('User authenticated with role: ADMIN')
  })

  it('does not log when user is not authenticated', () => {
    render(
      <RouteManager>
        <div>Test Content</div>
      </RouteManager>
    )
    
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it('updates log when user role changes', () => {
    const { rerender } = render(
      <RouteManager>
        <div>Test Content</div>
      </RouteManager>
    )

    mockUseAuthRouting.mockReturnValue({
      userRole: 'AGENT',
    })

    rerender(
      <RouteManager>
        <div>Test Content</div>
      </RouteManager>
    )
    
    expect(consoleSpy).toHaveBeenCalledWith('User authenticated with role: AGENT')
  })
}) 