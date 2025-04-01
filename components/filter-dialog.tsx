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
        <div className="p-3">
          <div className="mb-4 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <h3 className="text-lg font-medium">Filtry vyhledávání</h3>
          </div>
          
          <div className="space-y-4">
            {/* Formulářové filtry */}
            {filteredOptions.map((category) => {
              // Zjistíme, zda je tento filtr aktivní a jeho hodnotu
              const activeFilterValue = getActiveFilterValue(category.id)
              
              return (
                <div key={category.id} className="flex items-center gap-3">
                  <Label htmlFor={category.id} className="w-1/3 text-sm">{category.label}</Label>
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
                        <SelectTrigger id={category.id} className="w-full">
                          <SelectValue placeholder={activeFilterValue || "Vyberte..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {category.options.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex space-x-2">
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
                          className="w-full"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
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
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Aktivní filtry</h4>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <Badge 
                      key={filter.id}
                      variant="secondary"
                      className="pl-2 pr-1 py-1.5 flex items-center gap-1 text-xs"
                    >
                      <span className="font-medium">{filter.label}</span>
                      <span className="text-muted-foreground">:</span>
                      <span>{renderFilterValue(filter)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent rounded-full"
                        onClick={() => onRemoveFilter?.(filter.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setOpen(false);
                onCreateViewClick?.();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Vytvořit nový pohled
            </Button>
            
            <Button 
              variant="default"
              size="sm"
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

