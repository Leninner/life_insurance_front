'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layouts/DashboardLayout'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="Dashboard" description="Administra el sistema de manera general">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          actionLabel="Manage Users"
          onAction={() => console.log('Navigate to users')}
        />

        <DashboardCard
          actionLabel="Manage Policies"
          onAction={() => console.log('Navigate to policies')}
        />

        <DashboardCard
          actionLabel="View Reports"
          onAction={() => console.log('Navigate to reports')}
        />
      </div>
    </DashboardLayout>
  )
}
