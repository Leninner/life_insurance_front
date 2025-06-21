import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

describe('Table', () => {
  const TestTable = () => {
    return (
      <Table>
        <TableCaption>Test Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>30</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>25</TableCell>
            <TableCell>Designer</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total: 2 employees</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }

  it('renders table with all components', () => {
    render(<TestTable />)
    
    expect(screen.getByText('Test Table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Total: 2 employees')).toBeInTheDocument()
  })

  it('applies custom className to Table', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Test</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const table = screen.getByRole('table')
    expect(table).toHaveClass('custom-table')
  })

  it('applies custom className to TableHeader', () => {
    render(
      <Table>
        <TableHeader className="custom-header">
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    
    const header = screen.getByRole('rowgroup')
    expect(header).toHaveClass('custom-header')
  })

  it('applies custom className to TableBody', () => {
    render(
      <Table>
        <TableBody className="custom-body">
          <TableRow>
            <TableCell>Body</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const body = screen.getByRole('rowgroup')
    expect(body).toHaveClass('custom-body')
  })

  it('applies custom className to TableFooter', () => {
    render(
      <Table>
        <TableFooter className="custom-footer">
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
    
    const footer = screen.getByRole('rowgroup')
    expect(footer).toHaveClass('custom-footer')
  })

  it('applies custom className to TableRow', () => {
    render(
      <Table>
        <TableBody>
          <TableRow className="custom-row">
            <TableCell>Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const row = screen.getByRole('row')
    expect(row).toHaveClass('custom-row')
  })

  it('applies custom className to TableHead', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="custom-head">Head</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    
    const head = screen.getByRole('columnheader')
    expect(head).toHaveClass('custom-head')
  })

  it('applies custom className to TableCell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="custom-cell">Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const cell = screen.getByRole('cell')
    expect(cell).toHaveClass('custom-cell')
  })

  it('applies custom className to TableCaption', () => {
    render(
      <Table>
        <TableCaption className="custom-caption">Caption</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const caption = screen.getByText('Caption')
    expect(caption).toHaveClass('custom-caption')
  })

  it('handles row selection state', () => {
    render(
      <Table>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Selected Row</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const row = screen.getByRole('row')
    expect(row).toHaveAttribute('data-state', 'selected')
  })

  it('handles colspan in cells', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>Spanned Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    
    const cell = screen.getByRole('cell')
    expect(cell).toHaveAttribute('colspan', '2')
  })
}) 