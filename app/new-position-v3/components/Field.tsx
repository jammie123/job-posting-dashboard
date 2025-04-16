"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fields } from "@/app/new-position/first-step"
import { Sparkles, Loader2 } from "lucide-react"

interface FieldProps {
  initialValue?: string
  onChange?: (value: string) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Field({ 
  initialValue = "", 
  onChange, 
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: FieldProps) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)
  const [isGenerating, setIsGenerating] = useState(false)

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

  // Funkce pro automatické generování oboru
  const handleGenerateField = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    try {
      // Zde by byla implementace volání AI API
      // Pro demonstraci pouze simulujeme zpoždění
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vybereme náhodný obor z dostupných oborů
      const randomField = fields[Math.floor(Math.random() * fields.length)]
      
      // Nastavíme hodnotu
      setValue(randomField)
      if (onChange) {
        onChange(randomField)
      }
    } catch (error) {
      console.error("Chyba při generování oboru:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass}`}>
        <div className="flex justify-between items-center mr-2 w-full">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm min-w-[200px]">Obor:</h3>
            <p className="text-base">{value || "Nespecifikováno"}</p>
          </div>
          <div className="flex gap-1 absolute right-0 top-0 hidden group-hover:flex transition-opacity">
            {/* Ikona tlačítko pro generování oboru */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGenerateField}
              disabled={isGenerating}
              className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Vygenerovat obor"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Vygenerovat obor</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Vygenerovat obor
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
          Obor
        </Label>
        
        {/* Ikona tlačítko pro generování oboru */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleGenerateField}
          disabled={isGenerating}
          className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
          title="Vygenerovat obor"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Vygenerovat obor</span>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                Vygenerovat obor
              </div>
            </>
          )}
        </Button>
      </div>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Vyberte obor" />
        </SelectTrigger>
        <SelectContent>
          {fields.map((field) => (
            <SelectItem key={field} value={field}>
              {field}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Vyberte obor, ve kterém se pozice nachází.
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