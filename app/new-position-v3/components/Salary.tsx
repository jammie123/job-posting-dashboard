"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SalaryInput } from "@/app/new-position/components/salary-input"
import { Sparkles, Loader2 } from "lucide-react"

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
  const [isGenerating, setIsGenerating] = useState(false)

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

  // Funkce pro automatické generování mzdového rozmezí
  const handleGenerateSalary = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    try {
      // Zde by byla implementace volání AI API
      // Pro demonstraci pouze simulujeme zpoždění
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulujeme vygenerované mzdové rozmezí
      const generatedSalary = { from: 30000, to: 40000 }
      
      // Nastavíme hodnotu
      setValue(generatedSalary)
      setCurrency("czk")
      setPeriod("month")
      if (onChange) {
        onChange(generatedSalary)
      }
    } catch (error) {
      console.error("Chyba při generování mzdového rozmezí:", error)
    } finally {
      setIsGenerating(false)
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
          <div className="flex gap-1 absolute right-0 top-0 hidden group-hover:flex transition-opacity">
            {/* Ikona tlačítko pro generování mzdy */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGenerateSalary}
              disabled={isGenerating}
              className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Vygenerovat mzdové rozmezí"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Vygenerovat mzdové rozmezí</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Vygenerovat mzdové rozmezí
                  </div>
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7"
              onClick={toggleEdit}
            >
              Upravit
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 my-2 p-4 border border-gray-200 rounded-md ${blurClass}`}>
      <div className="flex justify-between items-center relative">
        <Label className="text-base font-medium">
          Nabízená mzda
        </Label>
        
        {/* Ikona tlačítko pro generování mzdy */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleGenerateSalary}
          disabled={isGenerating}
          className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
          title="Vygenerovat mzdové rozmezí"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Vygenerovat mzdové rozmezí</span>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                Vygenerovat mzdové rozmezí
              </div>
            </>
          )}
        </Button>
      </div>
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