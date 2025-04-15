"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, Sparkles, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { professions } from "@/app/new-position/first-step"
import { cn } from "@/lib/utils"

interface ProfessionProps {
  initialValue?: string[]
  onChange?: (value: string[]) => void
  isViewMode?: boolean
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function Profession({
  initialValue = [],
  onChange,
  isViewMode = false,
  isBlur = false,
  onEdit,
  onSave
}: ProfessionProps) {
  const [selected, setSelected] = useState<string[]>(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSelect = (value: string) => {
    const newValues = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value]
    
    setSelected(newValues)
    if (onChange) {
      onChange(newValues)
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

  // Funkce pro automatické generování profesí
  const handleGenerateProfessions = async () => {
    if (isGenerating) return
    
    setIsGenerating(true)
    try {
      // Zde by byla implementace volání AI API
      // Pro demonstraci pouze simulujeme zpoždění
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Vybereme 2-3 náhodné profese
      const count = Math.floor(Math.random() * 2) + 2; // 2 nebo 3
      const shuffled = [...professions].sort(() => 0.5 - Math.random());
      const randomProfessions = shuffled.slice(0, count);
      
      // Nastavíme hodnotu
      setSelected(randomProfessions)
      if (onChange) {
        onChange(randomProfessions)
      }
    } catch (error) {
      console.error("Chyba při generování profesí:", error)
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
            <h3 className="font-medium text-sm min-w-[200px]">Profese:</h3>
            <p className="text-base">{selected.length > 0 ? selected.join(", ") : "Nespecifikováno"}</p>
          </div>
          <div className="flex gap-1 absolute right-0 top-0 hidden group-hover:flex transition-opacity">
            {/* Ikona tlačítko pro generování profesí */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleGenerateProfessions}
              disabled={isGenerating}
              className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Vygenerovat profese"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Vygenerovat profese</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Vygenerovat profese
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
          Profese
        </Label>
        
        {/* Ikona tlačítko pro generování profesí */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleGenerateProfessions}
          disabled={isGenerating}
          className="h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
          title="Vygenerovat profese"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Vygenerovat profese</span>
              <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                Vygenerovat profese
              </div>
            </>
          )}
        </Button>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected.length > 0
              ? `${selected.length} profesí vybráno`
              : "Vyberte profese"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Hledat profesi..." />
            <CommandEmpty>Žádná profese nenalezena.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {professions.map((profession) => (
                <CommandItem
                  key={profession}
                  value={profession}
                  onSelect={() => handleSelect(profession)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(profession) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {profession}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <p className="text-sm text-muted-foreground">
        Vyberte všechny relevantní profese pro tuto pozici. Můžete vybrat více možností.
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