'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { UsersTable } from '@/modules/users/components/UsersTable'

export default function AgentClientsPage() {
  return (
    <DashboardLayout
      title="Gestión de Clientes"
      description="Administre la información de los clientes"
    >
      <UsersTable />
    </DashboardLayout>
  )
}
