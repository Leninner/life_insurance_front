'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function ReviewerDashboardPage() {
  return (
    <DashboardLayout
      title="Panel del Revisor"
      description="Revisa solicitudes, documentos y genera reportes"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Ver Pendientes"
          onAction={() => console.log('Navigate to pending')}
        />

        <DashboardCard
          actionLabel="Ver Documentos"
          onAction={() => console.log('Navigate to documents')}
        />

        <DashboardCard
          actionLabel="Ver Reportes"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>
    </DashboardLayout>
  )
}
