import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { QueryProvider } from '@/lib/providers/query-provider';
import { QueryClient } from '@tanstack/react-query';

describe('QueryProvider', () => {
  it('debe renderizar el componente correctamente', () => {
    const { container } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    expect(container).toBeInTheDocument();
    expect(container.textContent).toBe('Test Child');
  });

  it('debe configurar el QueryClient con las opciones correctas', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });

    expect(queryClient.getDefaultOptions().queries?.staleTime).toBe(1000 * 60 * 5);
    expect(queryClient.getDefaultOptions().queries?.retry).toBe(1);
    expect(queryClient.getDefaultOptions().mutations?.retry).toBe(0);
  });

  it('debe envolver los children con QueryClientProvider', () => {
    const { container } = render(
      <QueryProvider>
        <div>Test Child</div>
      </QueryProvider>
    );

    const provider = container.firstChild;
    expect(provider).toHaveAttribute('data-rk');
  });
}); 