"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LanguageSelector, SelectedLanguage } from "@/app/new-position/components/language-selector"
import { levels } from "@/app/new-position/first-step"

interface LanguageLevelProps {
  initialValue?: SelectedLanguage[]
  onChange?: (value: SelectedLanguage[]) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function LanguageLevel({ 
  initialValue = [], 
  onChange, 
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: LanguageLevelProps) {
  // Nastavení defaultních hodnot, pokud je initialValue prázdné pole
  const defaultLanguages: SelectedLanguage[] = [
    { code: "cs", name: "Čeština", level: "native" },
    { code: "en", name: "Angličtina", level: "basic" },
  ]
  
  const [selected, setSelected] = useState<SelectedLanguage[]>(
    initialValue.length > 0 ? initialValue : defaultLanguages
  )
  const [isEditing, setIsEditing] = useState(!isViewMode)

  const handleChange = (newSelected: SelectedLanguage[]) => {
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

  // Funkce pro získání čitelného názvu úrovně podle kódu
  const getLevelLabel = (levelCode: string) => {
    const levelObj = levels.find(l => l.value === levelCode)
    return levelObj ? levelObj.label : levelCode
  }

  // Funkce pro vytvoření textové reprezentace jazykových požadavků
  const getLanguagesText = () => {
    return selected.map(lang => `${lang.name}: ${getLevelLabel(lang.level)}`).join(", ")
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-start mr-2 w-full">
          <div className="flex items-start gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Jazyky:</h3>
            <p className="text-base">{getLanguagesText()}</p>
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
        Jazyky
      </Label>
      <LanguageSelector
        value={selected}
        onChange={handleChange}
      />
      <p className="text-sm text-muted-foreground">
        Vyberte jazyky, které jsou potřeba pro tuto pozici a úroveň jejich znalosti.
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