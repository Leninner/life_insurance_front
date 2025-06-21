import { describe, it, expect } from 'vitest';
import { RoleType } from '@/modules/auth/auth.interfaces';
import { publicRoutes, privateRoutes, allRoutes, roleDefaultRoutes } from '@/lib/routing/routes.config';

describe('routes.config', () => {
  describe('publicRoutes', () => {
    it('debe contener las rutas públicas correctas', () => {
      const publicPaths = publicRoutes.map(route => route.path);
      expect(publicPaths).toContain('/login');
      expect(publicPaths).toContain('/register');
      expect(publicPaths).toContain('/about');
    });

    it('debe tener la propiedad public como true', () => {
      publicRoutes.forEach(route => {
        expect(route.public).toBe(true);
      });
    });
  });

  describe('privateRoutes', () => {
    it('debe tener la propiedad public como false', () => {
      privateRoutes.forEach(route => {
        expect(route.public).toBe(false);
      });
    });

    it('debe tener rutas específicas para cada rol', () => {
      const adminRoutes = privateRoutes.filter(route => 
        route.allowedRoles?.includes(RoleType.ADMIN)
      );
      const clientRoutes = privateRoutes.filter(route => 
        route.allowedRoles?.includes(RoleType.CLIENT)
      );
      const agentRoutes = privateRoutes.filter(route => 
        route.allowedRoles?.includes(RoleType.AGENT)
      );
      const reviewerRoutes = privateRoutes.filter(route => 
        route.allowedRoles?.includes(RoleType.REVIEWER)
      );

      expect(adminRoutes.length).toBeGreaterThan(0);
      expect(clientRoutes.length).toBeGreaterThan(0);
      expect(agentRoutes.length).toBeGreaterThan(0);
      expect(reviewerRoutes.length).toBeGreaterThan(0);
    });

    it('debe tener rutas comunes sin restricción de roles', () => {
      const commonRoutes = privateRoutes.filter(route => 
        !route.allowedRoles || route.allowedRoles.length === 0
      );
      expect(commonRoutes.length).toBeGreaterThan(0);
    });
  });

  describe('allRoutes', () => {
    it('debe contener todas las rutas públicas y privadas', () => {
      expect(allRoutes.length).toBe(publicRoutes.length + privateRoutes.length);
    });

    it('no debe tener rutas duplicadas', () => {
      const paths = allRoutes.map(route => route.path);
      const uniquePaths = new Set(paths);
      expect(paths.length).toBe(uniquePaths.size);
    });
  });

  describe('roleDefaultRoutes', () => {
    it('debe tener una ruta por defecto para cada rol', () => {
      Object.values(RoleType).forEach(role => {
        expect(roleDefaultRoutes[role]).toBeDefined();
      });
    });

    it('debe tener rutas de dashboard específicas para cada rol', () => {
      expect(roleDefaultRoutes[RoleType.SUPER_ADMIN]).toBe('/admin/dashboard');
      expect(roleDefaultRoutes[RoleType.ADMIN]).toBe('/admin/dashboard');
      expect(roleDefaultRoutes[RoleType.AGENT]).toBe('/agent/dashboard');
      expect(roleDefaultRoutes[RoleType.CLIENT]).toBe('/client/dashboard');
      expect(roleDefaultRoutes[RoleType.REVIEWER]).toBe('/reviewer/dashboard');
    });
  });

  describe('RouteConfig', () => {
    it('debe tener las propiedades requeridas', () => {
      const route = privateRoutes[0];
      expect(route).toHaveProperty('path');
      expect(route).toHaveProperty('public');
    });

    it('puede tener propiedades opcionales', () => {
      const routeWithOptional = privateRoutes.find(r => r.exact !== undefined);
      expect(routeWithOptional).toBeDefined();
      if (routeWithOptional) {
        expect(routeWithOptional).toHaveProperty('exact');
      }
    });

    it('puede tener roles permitidos', () => {
      const routeWithRoles = privateRoutes.find(r => r.allowedRoles && r.allowedRoles.length > 0);
      expect(routeWithRoles).toBeDefined();
      if (routeWithRoles) {
        expect(Array.isArray(routeWithRoles.allowedRoles)).toBe(true);
      }
    });

    it('puede tener una redirección por defecto', () => {
      const routeWithRedirect = privateRoutes.find(r => r.defaultRedirect);
      expect(routeWithRedirect).toBeDefined();
      if (routeWithRedirect) {
        expect(typeof routeWithRedirect.defaultRedirect).toBe('string');
      }
    });
  });
}); 