"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { benefits } from "@/app/new-position/first-step"

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
    <div className={`space-y-2 my-2 p-4 border border-gray-200 rounded-md ${blurClass}`}>
      <Label className="text-base font-medium">
        Benefity
      </Label>
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