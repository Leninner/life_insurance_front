import React from 'react'
import { DateRange } from '@/modules/reports/reports.service'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      startDate: e.target.value,
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: e.target.value,
    })
  }

  return (
    <div className="flex items-end gap-4">
      <div className="flex-1">
        <Label htmlFor="startDate">Fecha Inicial</Label>
        <Input
          id="startDate"
          type="date"
          value={value.startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="endDate">Fecha Final</Label>
        <Input id="endDate" type="date" value={value.endDate} onChange={handleEndDateChange} />
      </div>
    </div>
  )
}
