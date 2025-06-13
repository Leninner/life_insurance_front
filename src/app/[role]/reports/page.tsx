'use client'

import React from 'react'
import { useReports } from '@/modules/reports/hooks/useReports'
import { DateRangeFilter } from '@/components/reports/DateRangeFilter'
import { ReportChart } from '@/components/reports/ReportChart'
import { format, subMonths } from 'date-fns'

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState({
    startDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  })

  const {
    unpaidInsurances,
    isUnpaidInsurancesLoading,
    contractsByClient,
    isContractsByClientLoading,
    pendingRequests,
    isPendingRequestsLoading,
    expiringContracts,
    isExpiringContractsLoading,
  } = useReports(dateRange)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reportes</h1>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isUnpaidInsurancesLoading && unpaidInsurances && (
          <ReportChart data={unpaidInsurances} title="Seguros Impagos" />
        )}

        {!isContractsByClientLoading && contractsByClient && (
          <ReportChart data={contractsByClient} title="Contratos por Cliente" />
        )}

        {!isPendingRequestsLoading && pendingRequests && (
          <ReportChart data={pendingRequests} title="Solicitudes Pendientes" />
        )}

        {!isExpiringContractsLoading && expiringContracts && (
          <ReportChart data={expiringContracts} title="Contratos por Vencer" />
        )}
      </div>
    </div>
  )
}
