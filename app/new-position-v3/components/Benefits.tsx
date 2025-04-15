"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { benefits } from "@/app/new-position/first-step"
import { Sparkles, Loader2 } from "lucide-react"

interface BenefitsProps {
  initialValue?: string[]
  onChange?: (value: string[]) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Benefits({ 
  initialValue = [], 
  onChange, 
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: BenefitsProps) {
  const [selected, setSelected] = useState<string[]>(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleToggle = (benefit: string) => {
    let newSelected: string[]
    
    if (selected.includes(benefit)) {
      newSelected = selected.filter(item => item !== benefit)
    } else {
      newSelected = [...selected, benefit]
    }
    
    setSelected(newSelected)
    if (onChange) {
      onChange(newSelected)
    }
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

  // Funkce pro automatické generování benefitů
  const handleGenerateBenefits = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    try {
      // Zde by byla implementace volání AI API
      // Pro demonstraci pouze simulujeme zpoždění
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vybereme 3-5 náhodných benefitů
      const count = Math.floor(Math.random() * 3) + 3; // 3, 4 nebo 5
      const shuffled = [...benefits].sort(() => 0.5 - Math.random());
      const randomBenefits = shuffled.slice(0, count);
      
      // Nastavíme hodnotu
      setSelected(randomBenefits)
      if (onChange) {
        onChange(randomBenefits)
      }
    } catch (error) {
      console.error("Chyba při generování benefitů:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-start mr-2 w-full ">
          <div className="flex items-start gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Benefity:</h3>
            {selected.length > 0 ? (
              <p className="text-base">{selected.join(", ")}</p>
            ) : (
              <p className="text-muted-foreground">Nespecifikováno</p>
            )}
          </div>
          <div className="flex gap-1 absolute right-0 top-0 hidden group-hover:flex transition-opacity">
            {/* Ikona tlačítko pro generování benefitů */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGenerateBenefits}
              disabled={isGenerating}
              className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Vygenerovat benefity"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Vygenerovat benefity</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Vygenerovat benefity
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
          Benefity
        </Label>
        
        {/* Ikona tlačítko pro generování benefitů */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleGenerateBenefits}
          disabled={isGenerating}
          className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
          title="Vygenerovat benefity"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Vygenerovat benefity</span>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                Vygenerovat benefity
              </div>
            </>
          )}
        </Button>
      </div>
      <div className="border rounded-md p-4">
        <div className="grid grid-cols-2 gap-4">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-start space-x-2">
              <Checkbox 
                id={`benefit-${benefit}`} 
                checked={selected.includes(benefit)}
                onCheckedChange={() => handleToggle(benefit)}
              />
              <Label 
                htmlFor={`benefit-${benefit}`}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {benefit}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Vyberte benefity, které nabízíte pro tuto pozici.
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