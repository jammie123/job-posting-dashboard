"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SalaryInputProps {
  onFromChange?: (value: string) => void
  onToChange?: (value: string) => void
  onCurrencyChange?: (value: string) => void
  onPeriodChange?: (value: string) => void
}

export function SalaryInput({ onFromChange, onToChange, onCurrencyChange, onPeriodChange }: SalaryInputProps) {
  return (
    <div className="space-y-4">
      <Label>Mzda</Label>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Od"
            className="w-[120px]"
            onChange={(e) => onFromChange?.(e.target.value)}
          />
          <span>-</span>
          <Input type="number" placeholder="Do" className="w-[120px]" onChange={(e) => onToChange?.(e.target.value)} />
        </div>
        <Select onValueChange={onCurrencyChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Měna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="czk">CZK</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="usd">USD</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Období" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">měsíc</SelectItem>
            <SelectItem value="hour">hodina</SelectItem>
            <SelectItem value="day">den</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

