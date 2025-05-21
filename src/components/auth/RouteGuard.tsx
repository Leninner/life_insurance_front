'use client';

import { PropsWithChildren, useEffect } from 'react';
import { useAuthRouting } from '../../hooks/useAuthRouting';

export function RouteGuard({ children }: PropsWithChildren) {
  const { handleRouteAccess, hydrated, pathname } = useAuthRouting();

  useEffect(() => {
    // Wait until auth state is hydrated to prevent unnecessary redirects
    if (!hydrated) return;

    // Handle all routing logic using our centralized hook
    handleRouteAccess();
  }, [pathname, hydrated, handleRouteAccess]);

  // Si no está hidratado, mostrar estado de carga
  if (!hydrated) {
    return <div>Cargando...</div>
  }

  // Si handleRouteAccess retorna false, no renderizar nada
  if (handleRouteAccess() === false) {
    return null
  }

  // Force null return for dashboard to prevent flash of content
  if (pathname === '/dashboard') {
    return null;
  }

  return <>{children}</>;
}
