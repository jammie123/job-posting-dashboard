"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"

interface JobNameProps {
  initialValue?: string
  onSubmit?: (value: string) => void
  onPrefilData?: (value: string, aiData?: any) => void
  onRegularForm?: () => void
  isViewMode?: boolean
  onChange?: (value: string) => void
  isDefaultView?: boolean
  userName?: string
  isBlur?: boolean
  onEdit?: () => void
  onSave?: () => void
}

export function JobName({ 
  initialValue = "", 
  onSubmit, 
  onPrefilData, 
  onRegularForm,
  isViewMode = false,
  onChange,
  isDefaultView = false,
  userName = "uživateli",
  isBlur = false,
  onEdit,
  onSave
}: JobNameProps) {
  const [value, setValue] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(!isViewMode)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && onSubmit) {
      onSubmit(value.trim())
    }
  }
  
  const handlePrefilData = async () => {
    if (!value.trim()) return

    setIsLoading(true)
    try {
      console.log("Odesílám požadavek na API s názvem pozice:", value.trim());
      
      let data;
      
      try {
        console.log("Zkouším volat OpenAI endpoint");
        const response = await fetch('/api/suggest-fields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: value.trim() }),
          // Zvýšíme timeout na 10 sekund, aby měl OpenAI více času na odpověď
          signal: AbortSignal.timeout(10000)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API vrátilo chybu:", errorData);
          
          if (errorData.error && errorData.error.includes("API key")) {
            console.log("OpenAI API klíč chybí nebo je neplatný");
          }
          
          throw new Error(errorData.error || 'Chyba při získávání dat z OpenAI API');
        }
        
        // Pokud je response OK, získáme data z OpenAI
        data = await response.json();
        console.log("Odpověď z OpenAI API:", data);
      } catch (err) {
        console.log("Volání OpenAI endpointu selhalo, použiji testovací endpoint:", err);
        
        // Pokud selže volání OpenAI, zkusíme testovací endpoint
        console.log("Přepínám na testovací endpoint");
        const testResponse = await fetch('/api/test-api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ position: value.trim() }),
        });
        
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error("Testovací API vrátilo chybu:", errorData);
          throw new Error(errorData.error || 'Chyba při získávání dat z testovacího API');
        }
        
        data = await testResponse.json();
        console.log("Odpověď z testovacího API:", data);
        
        // Indikace, že byla použita testovací data
        toast.info("Použita testovací data místo AI generovaných dat");
      }
      
      // Nyní máme data z OpenAI nebo z testovacího endpointu
      if (onPrefilData && data) {
        console.log("Volám onPrefilData callback s daty:", data);
        onPrefilData(value.trim(), data);
        toast.success("Data byla úspěšně předvyplněna");
      }
    } catch (error) {
      console.error("Chyba při předvyplňování dat:", error);
      toast.error("Nepodařilo se předvyplnit data: " + (error instanceof Error ? error.message : "Neznámá chyba"));
      if (onPrefilData) {
        console.log("Volám onPrefilData callback pouze s názvem pozice (bez dat)");
        onPrefilData(value.trim());
      }
    } finally {
      setIsLoading(false);
    }
  }

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
    
    if (!isEditing && onChange) {
      onChange(value)
    }
  }

  // CSS třídy pro rozmazání komponenty
  const blurClass = isBlur ? "filter blur-[13px] opacity-[0.5] brightness-[0.8] contrast-[120%]" : ""

  // Zobrazení uvítacího režimu při isDefaultView === true
  if (isDefaultView) {
    return (
      <div className="space-y-8 p-4">
        <div className="space-y-3 ">
          <h2 className="text-3xl font-semibold tracking-tight">
            Dobrý den {userName}
          </h2>

        </div>
        
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-50 text-gray-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Pomocník na vytvoření náboru</h3>
              <p className="text-gray-700 text-sm">
                Zadejte název pozice a nechte našeho pomocníka vyplnit detaily jako popis pozice, mzdové rozmezí, požadavky a benefity.
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job-name" className="text-base font-medium">
              Název náboru
            </Label>
            <Input
              id="job-name"
              placeholder="Např. Prodavačka v Alebrtu na naši pobočku PRaha 4"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-lg py-6"
              autoFocus
              required
            />
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              onClick={handlePrefilData}
              disabled={!value.trim() || isLoading}
              className="gap-2 py-6 px-5 text-base"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generuji data...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Předvyplnit formulář
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onRegularForm}
              disabled={isLoading}
              className="text-base"
              size="lg"
            >
              Přejít na běžný formulář
            </Button>
          </div>
        </form>
      </div>
    )
  }

  if (isViewMode && !isEditing) {
    return (
      <div className={`rounded-md flex relative group hover:bg-accent/5 transition-colors ${blurClass} items-center`}>
        <div className="flex justify-between items-center mr-2 w-full">
          <div className="flex items-center gap-2 mt-4">
            <h3 className="font-bold text-2xl">{value || "Nespecifikováno"}</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="absolute right-0 top-2 hidden group-hover:block transition-opacity h-7"
            onClick={toggleEdit}
          >
            Upravit
          </Button>
        </div>
      </div>
    )
  }
  
  // Pokud jsme v režimu úprav v isViewMode, zobrazíme jednodušší verzi
  if (isViewMode && isEditing) {
    return (
      <div className={`space-y-2 my-2 p-4 border border-gray-200 rounded-md ${blurClass}`}>
        <Label htmlFor="job-name" className="text-base font-medium">
          Název pozice
        </Label>
        <div className="relative">
          <Input
            id="job-name"
            placeholder="Např. Zedník do skansky"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full pr-10"
            autoFocus
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrefilData}
            disabled={!value.trim() || isLoading}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
            title="Předvyplnit data do formuláře"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Předvyplnit data do formuláře</span>
                <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                  Předvyplnit data do formuláře
                </div>
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={toggleEdit}>
            Uložit
          </Button>
        </div>
      </div>
    )
  }
  
  // Plná verze pro novou pozici
  return (
    <div className={`space-y-6 my-2 p-4 border border-gray-200 rounded-md ${blurClass} relative`}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="job-name" className="text-base font-medium">
            Název náboru
          </Label>
          <div className="relative">
            <Input
              id="job-name"
              placeholder="Např. Zedník do skansky"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full pr-10"
              autoFocus
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrefilData}
              disabled={!value.trim() || isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-1 rounded-full hover:bg-blue-100 hover:text-blue-700 group"
              title="Předvyplnit data do formuláře"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span className="sr-only">Předvyplnit data do formuláře</span>
                  <div className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs p-1.5 rounded whitespace-nowrap z-50 text-white">
                    Předvyplnit data do formuláře
                  </div>
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Zadejte název pozice, kterou potřebujete obsadit.
          </p>
        </div>
      </form>
    </div>
  )
} 