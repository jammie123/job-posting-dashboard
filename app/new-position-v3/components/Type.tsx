"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TypeProps {
  initialValue?: 'full' | 'part'
  onChange?: (value: 'full' | 'part') => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Type({ 
  initialValue = 'full', 
  onChange, 
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: TypeProps) {
  const [value, setValue] = useState<'full' | 'part'>(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)

  const handleChange = (newValue: 'full' | 'part') => {
    setValue(newValue)
    if (onChange) {
      onChange(newValue)
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

  const getTypeLabel = (type: 'full' | 'part') => {
    return type === 'full' ? 'Plný úvazek' : 'Částečný úvazek'
  }

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
      <div className="flex justify-between items-center mr-2 w-full ">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Typ úvazku:</h3>
            <p className="text-base">{getTypeLabel(value)}</p>
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
        Typ úvazku
      </Label>
      <RadioGroup value={value} onValueChange={(v) => handleChange(v as 'full' | 'part')} className="flex gap-8">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="full" id="full-time" />
          <Label htmlFor="full-time" className="font-normal">Plný úvazek</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="part" id="part-time" />
          <Label htmlFor="part-time" className="font-normal">Částečný úvazek</Label>
        </div>
      </RadioGroup>
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