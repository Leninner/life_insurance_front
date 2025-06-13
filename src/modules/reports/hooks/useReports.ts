import { useQuery } from '@tanstack/react-query'
import { reportsService, DateRange } from '../reports.service'

const keys = {
  all: ['reports'] as const,
  unpaid: () => [...keys.all, 'unpaid'] as const,
  contractsByClient: () => [...keys.all, 'contracts-by-client'] as const,
  pendingRequests: () => [...keys.all, 'pending-requests'] as const,
  expiringContracts: () => [...keys.all, 'expiring-contracts'] as const,
}

export const useReports = (dateRange?: DateRange) => {
  const unpaidInsurancesQuery = useQuery({
    queryKey: [...keys.unpaid(), dateRange],
    queryFn: async () => {
      const { data } = await reportsService.getUnpaidInsurances(dateRange)
      return data
    },
  })

  const contractsByClientQuery = useQuery({
    queryKey: [...keys.contractsByClient(), dateRange],
    queryFn: async () => {
      const { data } = await reportsService.getContractsByClient(dateRange)
      return data
    },
  })

  const pendingRequestsQuery = useQuery({
    queryKey: [...keys.pendingRequests(), dateRange],
    queryFn: async () => {
      const { data } = await reportsService.getPendingRequests(dateRange)
      return data
    },
  })

  const expiringContractsQuery = useQuery({
    queryKey: [...keys.expiringContracts(), dateRange],
    queryFn: async () => {
      const { data } = await reportsService.getExpiringContracts(dateRange)
      return data
    },
  })

  return {
    unpaidInsurances: unpaidInsurancesQuery.data,
    isUnpaidInsurancesLoading: unpaidInsurancesQuery.isLoading,
    isUnpaidInsurancesError: unpaidInsurancesQuery.isError,

    contractsByClient: contractsByClientQuery.data,
    isContractsByClientLoading: contractsByClientQuery.isLoading,
    isContractsByClientError: contractsByClientQuery.isError,

    pendingRequests: pendingRequestsQuery.data,
    isPendingRequestsLoading: pendingRequestsQuery.isLoading,
    isPendingRequestsError: pendingRequestsQuery.isError,

    expiringContracts: expiringContractsQuery.data,
    isExpiringContractsLoading: expiringContractsQuery.isLoading,
    isExpiringContractsError: expiringContractsQuery.isError,
  }
}
