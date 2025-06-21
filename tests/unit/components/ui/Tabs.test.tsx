import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

describe('Tabs', () => {
  const TestTabs = () => {
    return (
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )
  }

  it('renders tabs with default value', () => {
    render(<TestTabs />)
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Tab 3')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('switches content when clicking different tabs', async () => {
    render(<TestTabs />)
    
    // Initially shows content 1
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
    
    // Click tab 2
    await userEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Content 2')).toBeInTheDocument()
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument()
    
    // Click tab 3
    await userEvent.click(screen.getByText('Tab 3'))
    expect(screen.getByText('Content 3')).toBeInTheDocument()
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument()
  })

  it('applies active styles to selected tab', async () => {
    render(<TestTabs />)
    
    const tab1 = screen.getByText('Tab 1')
    const tab2 = screen.getByText('Tab 2')
    
    // Initially tab1 is active
    expect(tab1).toHaveAttribute('data-state', 'active')
    expect(tab2).toHaveAttribute('data-state', 'inactive')
    
    // Click tab2
    await userEvent.click(tab2)
    expect(tab1).toHaveAttribute('data-state', 'inactive')
    expect(tab2).toHaveAttribute('data-state', 'active')
  })

  it('handles custom className on TabsList', () => {
    const TestTabsWithCustomClass = () => {
      return (
        <Tabs defaultValue="tab1">
          <TabsList className="custom-class">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
    }

    render(<TestTabsWithCustomClass />)
    
    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('custom-class')
  })

  it('handles custom className on TabsTrigger', () => {
    const TestTabsWithCustomTrigger = () => {
      return (
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-class">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
        </Tabs>
      )
    }

    render(<TestTabsWithCustomTrigger />)
    
    const trigger = screen.getByRole('tab')
    expect(trigger).toHaveClass('custom-class')
  })

  it('handles custom className on TabsContent', () => {
    const TestTabsWithCustomContent = () => {
      return (
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="custom-class">
            Content 1
          </TabsContent>
        </Tabs>
      )
    }

    render(<TestTabsWithCustomContent />)
    
    const content = screen.getByText('Content 1')
    expect(content).toHaveClass('custom-class')
  })

  it('handles keyboard navigation', async () => {
    render(<TestTabs />)
    
    // Focus first tab
    const tab1 = screen.getByText('Tab 1')
    tab1.focus()
    
    // Press arrow right
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('Tab 2')).toHaveFocus()
    
    // Press arrow right again
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByText('Tab 3')).toHaveFocus()
    
    // Press arrow left
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByText('Tab 2')).toHaveFocus()
  })
}) 