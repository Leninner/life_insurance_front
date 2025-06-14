'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AgentDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Agente"
      description="Gestiona clientes, contratos y reembolsos"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Ver Clientes"
          onAction={() => console.log('Navigate to clients')}
        />

        <DashboardCard
          actionLabel="Ver Contratos"
          onAction={() => console.log('Navigate to contracts')}
        />

        <DashboardCard
          actionLabel="Ver Solicitudes"
          onAction={() => console.log('Navigate to reimbursements')}
        />
      </div>
    </DashboardLayout>
  )
}
