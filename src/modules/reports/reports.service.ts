import { getHttpClient } from '@/lib/http'
import { ApiResponse } from '../insurances'

const api = await getHttpClient()

export interface ReportData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
  }[]
}

export interface DateRange {
  startDate: string
  endDate: string
}

const defaultEmptyReport: ReportData = {
  labels: [],
  datasets: [
    {
      label: '',
      data: [],
    },
  ],
}

export const reportsService = {
  getUnpaidInsurances: async (params?: DateRange): Promise<ApiResponse<ReportData>> => {
    try {
      const response = await api.get<ReportData>('/reports/unpaid-insurances', {
        params,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch {
      return {
        success: false,
        data: defaultEmptyReport,
      }
    }
  },

  getContractsByClient: async (params?: DateRange): Promise<ApiResponse<ReportData>> => {
    try {
      const response = await api.get<ReportData>('/reports/contracts-by-client', {
        params,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch {
      return {
        success: false,
        data: defaultEmptyReport,
      }
    }
  },

  getPendingRequests: async (params?: DateRange): Promise<ApiResponse<ReportData>> => {
    try {
      const response = await api.get<ReportData>('/reports/pending-requests', {
        params,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch {
      return {
        success: false,
        data: defaultEmptyReport,
      }
    }
  },

  getExpiringContracts: async (params?: DateRange): Promise<ApiResponse<ReportData>> => {
    try {
      const response = await api.get<ReportData>('/reports/expiring-contracts', {
        params,
      })
      return {
        success: true,
        data: response.data,
      }
    } catch {
      return {
        success: false,
        data: defaultEmptyReport,
      }
    }
  },
}
