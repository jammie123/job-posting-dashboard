"use client"

import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { filterOptions, ActiveFilter } from "./job-filters"
import { Plus, X, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

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
  const [formState, setFormState] = useState<Record<string, string>>({})

  // Pomocná funkce pro zobrazení hodnoty filtru
  const renderFilterValue = (filter: ActiveFilter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.join(", ");
    }
    return filter.value;
  }

  // Aplikovat filtr z formuláře
  const applyFilter = (filterId: string, value: string) => {
    const filterOption = filterOptions.find(f => f.id === filterId)
    if (filterOption && value) {
      onFilterSelect?.(filterOption.label, value)
      
      // Reset hodnoty v lokálním stavu formuláře
      setFormState(prev => ({
        ...prev,
        [filterId]: ""
      }))
    }
  }

  // Zjistíme, které filtry jsou již aktivní
  const getActiveFilterIds = () => {
    return activeFilters.map(filter => filter.id)
  }

  // Filtrované možnosti - skryjeme "Název pozice" a "Náborář"
  const filteredOptions = filterOptions.filter(
    option => option.id !== "title" && option.id !== "recruiter"
  )

  // Získání aktuálně vybrané hodnoty pro filtr
  const getActiveFilterValue = (filterId: string) => {
    const filter = activeFilters.find(f => f.id === filterId)
    if (!filter) return ""
    
    if (Array.isArray(filter.value)) {
      return filter.value[0] || ""
    }
    
    return filter.value
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] max-h-[80vh] overflow-y-auto">
        <div className="p-2">

          <div className="space-y-1.5">
            {/* Formulářové filtry */}
            {filteredOptions.map((category) => {
              // Zjistíme, zda je tento filtr aktivní a jeho hodnotu
              const activeFilterValue = getActiveFilterValue(category.id)
              
              return (
                <div key={category.id} className="flex items-center gap-2">
                  <Label htmlFor={category.id} className="w-1/3 text-xs">{category.label}</Label>
                  <div className="flex-1">
                    {category.options.length > 0 ? (
                      <Select
                        value={activeFilterValue || formState[category.id] || ""}
                        onValueChange={(value) => {
                          setFormState(prev => ({
                            ...prev,
                            [category.id]: value
                          }))
                          applyFilter(category.id, value)
                        }}
                      >
                        <SelectTrigger id={category.id} className="w-full h-8 text-xs">
                          <SelectValue placeholder={activeFilterValue || "Vyberte..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {category.options.map(option => (
                            <SelectItem key={option} value={option} className="text-xs">
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex space-x-1">
                        <Input 
                          id={category.id}
                          value={formState[category.id] || ""}
                          onChange={(e) => {
                            setFormState(prev => ({
                              ...prev,
                              [category.id]: e.target.value
                            }))
                          }}
                          placeholder={activeFilterValue || "Zadejte hodnotu..."}
                          className="w-full h-8 text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-xs px-2"
                          onClick={() => applyFilter(category.id, formState[category.id] || "")}
                          disabled={!formState[category.id]}
                        >
                          Přidat
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            
            {/* Aktivní filtry */}
            {activeFilters.length > 0 && (
              <div className="pt-2 flex gap-2">
                <h4 className="text-xs font-medium mb-1 w-1/3">Aktivní filtry</h4>
                <div className="flex flex-wrap flex-1 gap-1">
                  {activeFilters.map((filter) => (
                    <Badge 
                      key={filter.id}
                      variant="secondary"
                      className="pl-1.5 pr-0.5 py-1 flex items-center gap-0.5 text-xs"
                    >
                      <span className="font-medium">{filter.label}</span>
                      <span className="text-muted-foreground">:</span>
                      <span>{renderFilterValue(filter)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3.5 w-3.5 p-0 ml-0.5 hover:bg-transparent rounded-full"
                        onClick={() => onRemoveFilter?.(filter.id)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => {
                setOpen(false);
                onCreateViewClick?.();
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Vytvořit nový pohled
            </Button>
            
            <Button 
              variant="default"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => setOpen(false)}
            >
              Použít filtry
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

