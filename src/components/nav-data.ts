import {
  IconDashboard,
  IconReport,
  IconUsers,
  IconShieldCheck,
  IconHeartHandshake,
  IconWallet,
  IconReportMedical,
  IconUser,
  IconCreditCard,
} from '@tabler/icons-react'
import { NavItem, PERMISSIONS, RoleType } from '@/modules/auth/auth.interfaces'

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: IconDashboard,
  },
  {
    title: 'Gestión de Seguros',
    url: '/admin/insurance',
    icon: IconShieldCheck,
  },
  {
    title: 'Gestión de Coberturas',
    url: '/admin/insurance/coverages',
    icon: IconShieldCheck,
  },
  {
    title: 'Gestión de Beneficios',
    url: '/admin/insurance/benefits',
    icon: IconShieldCheck,
  },
  {
    title: 'Gestión de Usuarios',
    url: '/admin/users',
    icon: IconUsers,
  },
  {
    title: 'Reportes',
    url: '/admin/reports',
    icon: IconReport,
    items: [
      {
        title: 'Seguros Impagos',
        url: '/admin/reports/unpaid',
      },
      {
        title: 'Contratos por Cliente',
        url: '/admin/reports/contracts-by-client',
      },
      {
        title: 'Solicitudes Pendientes',
        url: '/admin/reports/pending-requests',
      },
      {
        title: 'Contratos por Vencer',
        url: '/admin/reports/expiring-contracts',
      },
    ],
  },
]

export const agentNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/agent/dashboard',
    icon: IconDashboard,
    permissions: PERMISSIONS[RoleType.AGENT],
  },
  {
    title: 'Contratación de Seguros',
    url: '/agent/insurance-review',
    icon: IconHeartHandshake,
    permissions: PERMISSIONS[RoleType.AGENT],
  },
]

export const clientNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/client/dashboard',
    icon: IconDashboard,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Planes de Seguro',
    url: '/client/insurances',
    icon: IconShieldCheck,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Mis Seguros',
    url: '/client/my-insurances',
    icon: IconHeartHandshake,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Historial de Pagos',
    url: '/client/payments',
    icon: IconWallet,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
  {
    title: 'Reembolsos',
    url: '/client/reimbursements',
    icon: IconReportMedical,
    permissions: PERMISSIONS[RoleType.CLIENT],
  },
]

export const reviewerNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/reviewer/dashboard',
    icon: IconDashboard,
    permissions: PERMISSIONS[RoleType.REVIEWER],
  },
  {
    title: 'Solicitudes de Reembolsos',
    url: '/reviewer/reimbursements',
    icon: IconReportMedical,
    permissions: PERMISSIONS[RoleType.REVIEWER],
  },
]

export const secondaryNavItems: NavItem[] = [
  {
    title: 'Mi Perfil',
    url: '/profile',
    icon: IconUser,
  },
  {
    title: 'Métodos de Pago',
    url: '/payment-methods',
    icon: IconCreditCard,
  },
]
