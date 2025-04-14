"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { educationLevels } from "@/app/new-position/first-step"

interface EducationProps {
  initialValue?: string
  onChange?: (value: string) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Education({ 
  initialValue = "", 
  onChange, 
  isViewMode = false, 
  isBlur = false,
  onEdit,
  onSave
}: EducationProps) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)

  const handleChange = (newValue: string) => {
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

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass} max-w-[300px]`}>
        <div className="flex justify-between items-center mr-2 w-full">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Vzdělání:</h3>
            <p className="text-base">{value || "Nespecifikováno"}</p>
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
        Vzdělání
      </Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Vyberte úroveň vzdělání" />
        </SelectTrigger>
        <SelectContent>
          {educationLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Vyberte minimální požadovanou úroveň vzdělání pro tuto pozici.
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