import React from 'react'
import { ReportData } from '@/modules/reports/reports.service'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from '@/components/ui/chart'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

interface ReportChartProps {
  data: ReportData
  title: string
}

export const ReportChart: React.FC<ReportChartProps> = ({ data, title }) => {
  const chartData = data.labels.map((label, index) => ({
    name: label,
    ...data.datasets.reduce(
      (acc, dataset) => ({
        ...acc,
        [dataset.label]: dataset.data[index],
      }),
      {}
    ),
  }))

  const config = data.datasets.reduce(
    (acc, dataset) => ({
      ...acc,
      [dataset.label]: {
        label: dataset.label,
        theme: {
          light: 'rgb(75, 192, 192)',
          dark: 'rgb(75, 192, 192)',
        },
      },
    }),
    {}
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ChartContainer config={config}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip
            content={({ active, payload }) => (
              <ChartTooltipContent
                active={active}
                payload={payload}
                labelFormatter={(label) => label}
              />
            )}
          />
          {data.datasets.map((dataset) => (
            <Area
              key={dataset.label}
              type="monotone"
              dataKey={dataset.label}
              stroke="rgb(75, 192, 192)"
              fill="rgba(75, 192, 192, 0.2)"
            />
          ))}
          <ChartLegend />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
