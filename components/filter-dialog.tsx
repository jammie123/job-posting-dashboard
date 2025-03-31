"use client"

import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { filterOptions, ActiveFilter } from "./job-filters"
import { Plus, X } from "lucide-react"

interface FilterDialogProps {
  children: React.ReactNode
  onFilterSelect?: (category: string, option: string) => void
  activeFilters: ActiveFilter[]
  onRemoveFilter?: (filterId: string) => void
  onCreateViewClick?: () => void
}

export function FilterDialog({ 
  children, 
  onFilterSelect, 
  activeFilters = [], 
  onRemoveFilter,
  onCreateViewClick
}: FilterDialogProps) {
  const [open, setOpen] = useState(false)

  // Pomocná funkce pro zobrazení hodnoty filtru
  const renderFilterValue = (filter: ActiveFilter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.join(", ");
    }
    return filter.value;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[325px]">
        {/* Aktivní filtry */}
        {activeFilters.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Aktivní filtry
            </div>
            <div className="p-2 flex flex-wrap gap-1">
              {activeFilters.map((filter, index) => (
                <div key={`filter-${filter.id}-${index}`} className="flex items-center rounded-full bg-secondary text-xs px-2 py-1">
                  <span>
                    {filter.label}{filter.value && `: ${renderFilterValue(filter)}`}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    onClick={() => {
                      onRemoveFilter?.(filter.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        
        {/* Možnosti pro přidání nových filtrů */}
        <div className="grid p-1">
          {filterOptions
            .filter(category => {
              // Zjistíme, zda je tato kategorie již mezi aktivními filtry
              const activeFilter = activeFilters.find(f => f.id === category.id);
              
              // Pokud kategorie není mezi aktivními filtry, zobrazíme ji
              if (!activeFilter) return true;
              
              // Pokud je kategorie aktivní, ale podporuje více hodnot (isMulti), stále ji zobrazíme
              return activeFilter.isMulti;
            })
            .map((category) => (
              <DropdownMenuSub key={category.id}>
                <DropdownMenuSubTrigger className="px-2 py-1.5 text-sm font-medium">
                  {category.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-[200px]">
                  {category.options.map((option) => {
                    // Pro filtry typu isMulti, které již existují, kontrolujeme také,
                    // zda daná možnost již není vybrána
                    const activeFilter = activeFilters.find(f => f.id === category.id);
                    const isOptionSelected = activeFilter?.isMulti && Array.isArray(activeFilter.value) && 
                      activeFilter.value.includes(option);
                    
                    // Pokud je možnost již vybrána, nezobrazujeme ji
                    if (isOptionSelected) return null;
                    
                    return (
                      <DropdownMenuItem
                        key={option}
                        onClick={() => {
                          onFilterSelect?.(category.label, option)
                          setOpen(false)
                        }}
                      >
                        {option}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ))}
        </div>
        
        {/* Tlačítko pro vytvoření nového pohledu */}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center px-2 py-1.5 text-sm font-medium cursor-pointer"
          onClick={() => {
            setOpen(false);
            onCreateViewClick?.();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Vytvořit nový pohled
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

