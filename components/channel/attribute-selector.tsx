"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Ukázkový seznam atributů, který by mohl přicházet z XML souboru nebo API
const importAttributes = [
  "First Name",
  "Last Name",
  "Email",
  "Phone",
  "Mobile",
  "Designation",
  "Department",
  "Location",
  "Zip Code",
  "Postal Code",
  "City",
  "State",
  "Country",
  "Address",
  "Address Line 1",
  "Address Line 2",
]

interface AttributeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function AttributeSelector({ value, onChange }: AttributeSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-left font-normal ml-2"
        >
          <Search className="h-4 w-4 mr-2" />
          <span>Vybrat atribut</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" side="top">
        <Command>
          <CommandInput placeholder="Hledat atribut..." />
          <CommandList>
            <CommandEmpty>Žádný atribut nenalezen.</CommandEmpty>
            <CommandGroup>
              {importAttributes.map((attribute) => (
                <CommandItem
                  key={attribute}
                  value={attribute}
                  onSelect={(selectedValue) => {
                    onChange(selectedValue === value ? "" : selectedValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === attribute ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {attribute}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 