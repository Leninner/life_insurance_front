import { render, screen, fireEvent } from '@testing-library/react'
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { vi } from 'vitest'

// Mock del hook useIsMobile
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}))

describe('Sidebar', () => {
  const TestSidebar = () => {
    return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>Header</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Group Label</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Menu Item</SidebarMenuButton>
                    <SidebarMenuAction>Action</SidebarMenuAction>
                    <SidebarMenuBadge>Badge</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>Sub Item</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
  }

  it('renders sidebar with all components', () => {
    render(<TestSidebar />)
    
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Group Label')).toBeInTheDocument()
    expect(screen.getByText('Menu Item')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('Badge')).toBeInTheDocument()
    expect(screen.getByText('Sub Item')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('toggles sidebar when trigger is clicked', () => {
    render(<TestSidebar />)
    const trigger = screen.getByTestId('sidebar-trigger')
    fireEvent.click(trigger)
    // Aquí se pueden agregar expectativas adicionales si es necesario
  })

  it('applies custom className to Sidebar', () => {
    render(
      <SidebarProvider>
        <Sidebar className="custom-sidebar">
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveClass('custom-sidebar')
  })

  it('applies custom className to SidebarHeader', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="custom-header">Header</SidebarHeader>
        </Sidebar>
      </SidebarProvider>
    )
    
    const header = screen.getByText('Header')
    expect(header).toHaveClass('custom-header')
  })

  it('applies custom className to SidebarContent', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent className="custom-content">Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const content = screen.getByText('Content')
    expect(content).toHaveClass('custom-content')
  })

  it('applies custom className to SidebarFooter', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarFooter className="custom-footer">Footer</SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    )
    
    const footer = screen.getByText('Footer')
    expect(footer).toHaveClass('custom-footer')
  })

  it('applies custom className to SidebarGroup', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup className="custom-group">
              <SidebarGroupLabel>Label</SidebarGroupLabel>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const group = screen.getByText('Label').parentElement
    expect(group).toHaveClass('custom-group')
  })

  it('applies custom className to SidebarGroupLabel', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="custom-label">Label</SidebarGroupLabel>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const label = screen.getByText('Label')
    expect(label).toHaveClass('custom-label')
  })

  it('applies custom className to SidebarMenuButton', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="custom-button">Button</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const button = screen.getByText('Button')
    expect(button).toHaveClass('custom-button')
  })

  it('applies custom className to SidebarMenuAction', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Button</SidebarMenuButton>
                <SidebarMenuAction className="custom-action">Action</SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const action = screen.getByText('Action')
    expect(action).toHaveClass('custom-action')
  })

  it('applies custom className to SidebarMenuBadge', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Button</SidebarMenuButton>
                <SidebarMenuBadge className="custom-badge">Badge</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const badge = screen.getByText('Badge')
    expect(badge).toHaveClass('custom-badge')
  })

  it('renders SidebarMenuSkeleton with icon', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon={true} />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const skeleton = screen.getByRole('status')
    expect(skeleton).toBeInTheDocument()
  })

  it('applies custom className to SidebarMenuSubButton', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton className="custom-sub-button">Sub Button</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
    
    const subButton = screen.getByText('Sub Button')
    expect(subButton).toHaveClass('custom-sub-button')
  })
}) 