"use client"

import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Aktualizovaný seznam náborářů podle dat v mock-jobs.json
const recruiters = [
  "Všichni náboráři",
  "Anna Kovářová",
  "Martin Horák",
  "Lucie Svobodová",
]

interface RecruiterFilterProps {
  onRecruiterChange?: (value: string) => void
  initialValue?: string
}

export function RecruiterFilter({ onRecruiterChange, initialValue = "Anna Kovářová" }: RecruiterFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialValue)
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue("");
    if (onRecruiterChange) {
      onRecruiterChange("");
    }
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="flex gap-2 px-3 justify-between min-w-[220px]">
          <span className="text-muted-foreground text-sm">Náborář:</span>
          <div className="flex flex-row gap-2 items-center justify-between flex-1">
            {value ? (
              <div className="flex items-center justify-between w-full font-normal">
                <span>{value}</span>
                {/* {value === "Anna Kovářová" && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Moje nábory</span>
                    <X 
                      className="h-3.5 w-3.5 opacity-70 hover:opacity-100 cursor-pointer" 
                      onClick={handleClear}
                    />
                  </div>
                )} */}
              </div>
            ) : (
              <span className="text-muted-foreground">Všichni náboráři</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <Command>
          <CommandInput placeholder="Hledat náboráře..." />
          <CommandList>
            <CommandEmpty>Žádný náborář nenalezen.</CommandEmpty>
            <CommandGroup>
              {recruiters.map((recruiter) => (
                <CommandItem
                  key={recruiter}
                  value={recruiter}
                  onSelect={(currentValue) => {
                    // Logování akce pro debugging
                    console.log(`Vybrán náborář: ${currentValue}`);
                    
                    // Pokud je vybrán "Všichni náboráři", nastavíme prázdnou hodnotu filtru
                    const newValue = currentValue === "Všichni náboráři" ? "" : currentValue;
                    
                    // Nastavení hodnoty pro UI a zpětné volání pro rodiče
                    setValue(currentValue === "Všichni náboráři" ? "" : currentValue);
                    
                    // Informovat rodičovskou komponentu o změně filtru
                    if (onRecruiterChange) {
                      console.log(`Informuji rodiče o změně filtru náboráře na: "${newValue}"`);
                      onRecruiterChange(newValue);
                    }
                    
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === recruiter || (value === "" && recruiter === "Všichni náboráři") ? "opacity-100" : "opacity-0")} />
                  {recruiter}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

