"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SalaryInput } from "@/app/new-position/components/salary-input"

interface SalaryProps {
  initialValue?: { from: number; to: number; }
  onChange?: (value: { from: number; to: number; }) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Salary({ initialValue = { from: 0, to: 0 }, onChange, isViewMode = false, isBlur = false, onEdit, onSave }: SalaryProps) {
  const [value, setValue] = useState(initialValue)
  const [currency, setCurrency] = useState<string>("czk")
  const [period, setPeriod] = useState<string>("month")
  const [isEditing, setIsEditing] = useState(!isViewMode)

  useEffect(() => {
    console.log(`Salary - došlo ke změně initialValue na:`, initialValue);
    if (initialValue && (initialValue.from !== value.from || initialValue.to !== value.to)) {
      setValue(initialValue);
    }
  }, [initialValue, value]);

  const handleSalaryChange = (newValue: { from: number; to: number; }) => {
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
  }

  const toggleEdit = () => {
    if (!isEditing && onEdit) {
      onEdit()
    }
    
    setIsEditing(!isEditing)
    
    if (isEditing && onSave) {
      onSave()
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  // Získání textové reprezentace mzdy
  const getSalaryText = () => {
    const { from, to } = value;
    const currencyText = currency.toUpperCase();
    const periodText = period === 'month' ? 'měsíčně' : period === 'hour' ? 'za hodinu' : 'denně';
    
    if (from === 0 && to === 0) {
      return "Nespecifikováno";
    } else if (from === to) {
      return `${from.toLocaleString()} ${currencyText} ${periodText}`;
    } else {
      return `${from.toLocaleString()} - ${to.toLocaleString()} ${currencyText} ${periodText}`;
    }
  }

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-center mr-2 w-full">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Nabízená mzda:</h3>
            <p className="text-base">{getSalaryText()}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-0 hidden group-hover:block transition-opacity h-7"
            onClick={toggleEdit}
          >
            Upravit
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 p-4 border border-gray-200 rounded-md ${blurClass}`}>
      <Label className="text-base font-medium">
        Nabízená mzda
      </Label>
      <SalaryInput
        defaultValues={value}
        onSalaryChange={handleSalaryChange}
        onCurrencyChange={handleCurrencyChange}
        onPeriodChange={handlePeriodChange}
      />
      <p className="text-sm text-muted-foreground">
        Definujte rozmezí nabízené mzdy.
      </p>
      {isViewMode && (
        <div className="flex justify-end mt-4">
          <Button onClick={toggleEdit}>
            Uložit
          </Button>
        </div>
      )}
    </div>
  )
} 