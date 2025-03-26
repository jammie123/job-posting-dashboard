"use client"

import * as React from "react"
import { Check } from "lucide-react"
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
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? (
            <div className="flex flex-row items-center justify-between w-full">
              <span>{value}</span>
              {value === "Anna Kovářová" && (
                <span className="text-xs text-muted-foreground">Moje nábory</span>
              )}
            </div>
          ) : (
            "Všichni náboráři"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
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

