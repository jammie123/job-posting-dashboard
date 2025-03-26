"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface MultiSelectProps {
  options: string[] | { [key: string]: string[] }
  selected: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  isRemote?: boolean
  headquartersAddress?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  isRemote = false,
  headquartersAddress,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const isGrouped = !Array.isArray(options)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {isRemote && headquartersAddress
            ? headquartersAddress
            : selected.length > 0
              ? selected.join(", ")
              : placeholder || "Select..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search options..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            {isGrouped ? (
              // Render grouped options
              Object.entries(options).map(([group, items], index) => (
                <React.Fragment key={group}>
                  {/* Add a special divider after branches group if this is localities data */}
                  {group === "branches" && <CommandSeparator className="my-1" />}
                  {/* Only add regular separator between groups if it's not after headquarters or before others */}
                  {index > 0 && group !== "others" && group !== "branches" && <CommandSeparator />}
                  <CommandGroup heading={group === "headquarters" ? "Centrála" : group === "branches" ? "Pobočky" : ""}>
                    {items.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          if (selected.includes(option)) {
                            onChange(selected.filter((s) => s !== option))
                          } else {
                            onChange([...selected, option])
                          }
                        }}
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")}
                        />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))
            ) : (
              // Render flat options list
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      if (selected.includes(option)) {
                        onChange(selected.filter((s) => s !== option))
                      } else {
                        onChange([...selected, option])
                      }
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", selected.includes(option) ? "opacity-100" : "opacity-0")} />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onChange([])
                    }}
                  >
                    Clear all
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

