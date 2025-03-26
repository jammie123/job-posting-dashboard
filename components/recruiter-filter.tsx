"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const recruiters = [
  "Všichni náboráři",
  "Anna K.",
  "Martin H.",
  "Petra N.",
  "Jan B.",
  "Eva M.",
  "Tomáš R.",
  "Lucie S.",
  "David P.",
  "Markéta V.",
  "Filip K.",
]

interface RecruiterFilterProps {
  onRecruiterChange?: (value: string) => void
}

export function RecruiterFilter({ onRecruiterChange }: RecruiterFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("Anna K.")

  React.useEffect(() => {
    // Notify parent components of the initial selection
    onRecruiterChange?.("Anna K.")
  }, [onRecruiterChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value === "Anna K." ? (
            <div className="flex flex-row items-center justify-between w-full">
              <span>Anna K.</span>
              <span className="text-xs text-muted-foreground">Moje nábory</span>
            </div>
          ) : value && value !== "Všichni náboráři" ? (
            recruiters.find((recruiter) => recruiter === value)
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
                    const newValue = currentValue === "Všichni náboráři" ? "" : currentValue
                    setValue(currentValue === value ? "" : currentValue)
                    onRecruiterChange?.(newValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === recruiter ? "opacity-100" : "opacity-0")} />
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

