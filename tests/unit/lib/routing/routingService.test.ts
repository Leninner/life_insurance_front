import { describe, it, expect } from 'vitest';
import { RoutingService } from '@/lib/routing/routingService';
import { RoleType } from '@/modules/auth/auth.interfaces';
import { allRoutes, roleDefaultRoutes } from '@/lib/routing/routes.config';

describe('RoutingService', () => {
  let routingService: RoutingService;

  beforeEach(() => {
    routingService = new RoutingService();
  });

  describe('isPublicRoute', () => {
    it('debe retornar true para rutas públicas', () => {
      const publicRoute = allRoutes.find(route => route.public);
      expect(publicRoute).toBeDefined();
      if (publicRoute) {
        expect(routingService.isPublicRoute(publicRoute.path)).toBe(true);
      }
    });

    it('debe retornar false para rutas privadas', () => {
      const privateRoute = allRoutes.find(route => !route.public);
      expect(privateRoute).toBeDefined();
      if (privateRoute) {
        expect(routingService.isPublicRoute(privateRoute.path)).toBe(false);
      }
    });

    it('debe retornar false para rutas no encontradas', () => {
      expect(routingService.isPublicRoute('/ruta-inexistente')).toBe(false);
    });
  });

  describe('isPrivateRoute', () => {
    it('debe retornar true para rutas privadas', () => {
      const privateRoute = allRoutes.find(route => !route.public);
      expect(privateRoute).toBeDefined();
      if (privateRoute) {
        expect(routingService.isPrivateRoute(privateRoute.path)).toBe(true);
      }
    });

    it('debe retornar false para rutas públicas', () => {
      const publicRoute = allRoutes.find(route => route.public);
      expect(publicRoute).toBeDefined();
      if (publicRoute) {
        expect(routingService.isPrivateRoute(publicRoute.path)).toBe(false);
      }
    });
  });

  describe('findRouteConfig', () => {
    it('debe encontrar la configuración de una ruta exacta', () => {
      const route = allRoutes[0];
      const foundRoute = routingService.findRouteConfig(route.path);
      expect(foundRoute).toEqual(route);
    });

    it('debe encontrar la configuración de una ruta con subrutas', () => {
      const route = allRoutes.find(r => !r.exact);
      expect(route).toBeDefined();
      if (route) {
        const foundRoute = routingService.findRouteConfig(`${route.path}/subruta`);
        expect(foundRoute).toEqual(route);
      }
    });

    it('debe retornar undefined para rutas no encontradas', () => {
      const foundRoute = routingService.findRouteConfig('/ruta-inexistente');
      expect(foundRoute).toBeUndefined();
    });
  });

  describe('canUserAccessRoute', () => {
    it('debe permitir acceso a rutas públicas sin roles', () => {
      const publicRoute = allRoutes.find(route => route.public);
      expect(publicRoute).toBeDefined();
      if (publicRoute) {
        expect(routingService.canUserAccessRoute(publicRoute.path, RoleType.USER)).toBe(true);
      }
    });

    it('debe permitir acceso a rutas con roles permitidos', () => {
      const route = allRoutes.find(r => r.allowedRoles && r.allowedRoles.length > 0);
      expect(route).toBeDefined();
      if (route && route.allowedRoles) {
        expect(routingService.canUserAccessRoute(route.path, route.allowedRoles[0])).toBe(true);
      }
    });

    it('debe denegar acceso a rutas con roles no permitidos', () => {
      const route = allRoutes.find(r => r.allowedRoles && r.allowedRoles.length > 0);
      expect(route).toBeDefined();
      if (route && route.allowedRoles) {
        const nonAllowedRole = Object.values(RoleType).find(role => !route.allowedRoles?.includes(role));
        if (nonAllowedRole) {
          expect(routingService.canUserAccessRoute(route.path, nonAllowedRole)).toBe(false);
        }
      }
    });
  });

  describe('getUnauthenticatedRedirect', () => {
    it('debe retornar la ruta de redirección por defecto', () => {
      const route = allRoutes.find(r => r.defaultRedirect);
      expect(route).toBeDefined();
      if (route) {
        expect(routingService.getUnauthenticatedRedirect(route.path)).toBe(route.defaultRedirect);
      }
    });

    it('debe retornar /login para rutas sin redirección por defecto', () => {
      const route = allRoutes.find(r => !r.defaultRedirect);
      expect(route).toBeDefined();
      if (route) {
        expect(routingService.getUnauthenticatedRedirect(route.path)).toBe('/login');
      }
    });
  });

  describe('getRoleDefaultRoute', () => {
    it('debe retornar la ruta por defecto para un rol', () => {
      Object.entries(roleDefaultRoutes).forEach(([role, path]) => {
        expect(routingService.getRoleDefaultRoute(role as RoleType)).toBe(path);
      });
    });

    it('debe retornar /login para roles sin ruta por defecto', () => {
      const nonDefaultRole = Object.values(RoleType).find(role => !roleDefaultRoutes[role]);
      if (nonDefaultRole) {
        expect(routingService.getRoleDefaultRoute(nonDefaultRole)).toBe('/login');
      }
    });
  });

  describe('needsRoleBasedRedirect', () => {
    it('debe retornar true para rutas especiales', () => {
      expect(routingService.needsRoleBasedRedirect('/')).toBe(true);
      expect(routingService.needsRoleBasedRedirect('/dashboard')).toBe(true);
    });

    it('debe retornar false para otras rutas', () => {
      expect(routingService.needsRoleBasedRedirect('/otra-ruta')).toBe(false);
    });
  });

  describe('isAuthRoute', () => {
    it('debe retornar true para rutas de autenticación', () => {
      expect(routingService.isAuthRoute('/login')).toBe(true);
      expect(routingService.isAuthRoute('/register')).toBe(true);
    });

    it('debe retornar false para otras rutas', () => {
      expect(routingService.isAuthRoute('/dashboard')).toBe(false);
    });
  });
}); 