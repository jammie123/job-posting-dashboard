"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { MultiSelect } from "@/components/ui/multi-select"
import { localities } from "@/app/new-position/first-step"

interface LocalityProps {
  workplaces: any[]
  isRemote: boolean
  onChange: (workplaces: any[], isRemote: boolean) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Locality({ 
  workplaces, 
  isRemote, 
  onChange,
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: LocalityProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedWorkplaces, setSelectedWorkplaces] = useState<any[]>(workplaces || [])
  const [isRemoteWork, setIsRemoteWork] = useState<boolean>(isRemote || false)

  const handleChange = (newSelected: any[]) => {
    setSelectedWorkplaces(newSelected)
    if (onChange) {
      onChange(newSelected, isRemoteWork)
    }
  }

  const handleRemoteChange = (checked: boolean) => {
    setIsRemoteWork(checked)
    if (onChange) {
      // Při zapnutí remote režimu předáme prázdné pole lokalit
      onChange(checked ? [] : selectedWorkplaces, checked)
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

  // Získání textové reprezentace lokalit
  const getLocationText = () => {
    if (isRemoteWork) {
      return `Vzdálená práce (${localities.headquarters[0]})`;
    } else if (selectedWorkplaces.length > 0) {
      return selectedWorkplaces.join(", ");
    } else {
      return "Nespecifikováno";
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : "";

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-center mr-2 w-full">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Místo výkonu práce:</h3>
            <p className="text-base">{getLocationText()}</p>
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
    <div className={`space-y-4 p-4 border border-gray-200 rounded-md ${blurClass}`}>
      <div className="flex justify-between items-center">
        <Label htmlFor="location-select" className="text-base font-medium">
          Místo výkonu práce
        </Label>
        <div className="flex items-center gap-2">
          <Switch
            id="remote-switch"
            checked={isRemoteWork}
            onCheckedChange={handleRemoteChange}
          />
          <Label htmlFor="remote-switch" className="text-sm font-normal cursor-pointer">
            Vzdálená práce
          </Label>
        </div>
      </div>

      {!isRemoteWork && (
        <MultiSelect
          options={[...localities.headquarters, ...localities.branches, ...localities.others]}
          selected={selectedWorkplaces}
          onChange={handleChange}
          placeholder="Vyberte lokality"
          isRemote={isRemoteWork}
          headquartersAddress={localities.headquarters[0]}
        />
      )}

      {isRemoteWork && (
        <p className="text-sm text-muted-foreground">
          U vzdálené práce bude použita adresa vaší firmy: {localities.headquarters[0]}
        </p>
      )}

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