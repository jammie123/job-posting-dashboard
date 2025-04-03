"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ActiveFilter, filterOptions } from "./job-filters"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobViewConfig } from "./job-views"

interface EditViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: JobViewConfig | null
  onSave: (viewId: string, viewName: string, filters: ActiveFilter[]) => void
  onDelete: (viewId: string) => void
  jobCount?: number
}

export function EditViewDialog({ 
  open, 
  onOpenChange, 
  view, 
  onSave, 
  onDelete,
  jobCount = 0 
}: EditViewDialogProps) {
  const [viewName, setViewName] = useState("")
  const [formState, setFormState] = useState<Record<string, string>>({})
  const [localFilters, setLocalFilters] = useState<ActiveFilter[]>([])

  // Reset stavu při otevření dialogu
  useEffect(() => {
    if (open && view) {
      setViewName(view.label)
      
      // Konvertujeme filtry z objektu view na pole ActiveFilter objektů
      const filtersFromView: ActiveFilter[] = [];
      
      if (view.filters) {
        Object.entries(view.filters).forEach(([key, value]) => {
          if (key === "status" && value) {
            filtersFromView.push({
              id: "status",
              label: "Stav náboru",
              value: value as string
            });
          } 
          else if (key === "advertisement.status" && value) {
            if (Array.isArray(value)) {
              filtersFromView.push({
                id: "adStatus",
                label: "Stav inzerátu",
                value: value,
                isMulti: true
              });
            } else {
              filtersFromView.push({
                id: "adStatus",
                label: "Stav inzerátu",
                value: value as string
              });
            }
          }
          else if (key === "location" && value) {
            filtersFromView.push({
              id: "location",
              label: "Lokalita",
              value: value as string
            });
          }
          else if (key === "department" && value) {
            filtersFromView.push({
              id: "department",
              label: "Oddělení",
              value: value as string
            });
          }
          else if (key === "title" && value) {
            filtersFromView.push({
              id: "title",
              label: "Název pozice", 
              value: value as string
            });
          }
          else if (key === "recruiter" && value) {
            filtersFromView.push({
              id: "recruiter",
              label: "Náborář", 
              value: value as string
            });
          }
        });
      }
      
      setLocalFilters(filtersFromView);
    }
  }, [open, view])

  const handleSave = () => {
    if (viewName.trim() && view) {
      onSave(view.value, viewName, localFilters)
      onOpenChange(false)
    }
  }

  const handleDelete = () => {
    if (view) {
      onDelete(view.value)
      onOpenChange(false)
    }
  }

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
      const newFilter = {
        id: filterId,
        label: filterOption.label,
        value: value
      }

      // Kontrola, zda již existuje filtr se stejným ID
      const existingFilterIndex = localFilters.findIndex(f => f.id === filterId)
      
      if (existingFilterIndex >= 0) {
        // Aktualizace existujícího filtru
        const updatedFilters = [...localFilters]
        updatedFilters[existingFilterIndex] = newFilter
        setLocalFilters(updatedFilters)
      } else {
        // Přidání nového filtru
        setLocalFilters([...localFilters, newFilter])
      }
      
      // Reset hodnoty v lokálním stavu formuláře, ale ne pro title
      if (filterId !== "title") {
        setFormState(prev => ({
          ...prev,
          [filterId]: ""
        }))
      }
    }
  }

  // Získání aktuálně vybrané hodnoty pro filtr
  const getActiveFilterValue = (filterId: string) => {
    const filter = localFilters.find(f => f.id === filterId)
    if (!filter) return ""
    
    if (Array.isArray(filter.value)) {
      return filter.value[0] || ""
    }
    
    return filter.value
  }

  // Odstranění filtru
  const removeFilter = (filter: ActiveFilter) => {
    setLocalFilters(localFilters.filter(f => !(f.id === filter.id && f.value === filter.value)))
  }

  // Spočítá počet nabídek odpovídajících aktuálním filtrům
  const getJobCountForCurrentFilters = (): number => {
    // V reálné implementaci by tato funkce mohla volat API nebo používat předané hodnoty
    // Pro ukázku vrátíme buď předanou hodnotu jobCount, nebo mockup
    return jobCount || Math.floor(Math.random() * 100) + 5;
  }

  if (!view) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upravit nastavení pohledu</DialogTitle>
          <DialogDescription>Změňte název nebo upravte nastavení filtrů</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="w-full items-start gap-4">
            <Input
              id="viewName"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="w-full !text-sm"
              placeholder="Název pohledu"
              autoFocus
            />
          </div>
          
          {/* Filtry ve stylu filter-dialog */}
          <div className="space-y-1.5">
            <h3 className="text-sm font-medium mb-2">Filtry</h3>
            
            {/* Formulářové filtry - nejprve "Název pozice", poté ostatní */}
            {[...filterOptions].sort((a, b) => 
              a.id === "title" ? -1 : b.id === "title" ? 1 : 0
            ).map((category) => {
              // Zjistíme, zda je tento filtr aktivní a jeho hodnotu
              const activeFilterValue = getActiveFilterValue(category.id)
              
              return (
                <div key={category.id} className="flex items-center gap-2">
                  <Label htmlFor={category.id} className="w-1/3 text-xs">{category.label}</Label>
                  <div className="flex-1 ">
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
                    ) : category.id === "title" ? (
                      // Pro "Název pozice" zobrazit pouze Input bez tlačítka
                      <Input 
                        id={category.id}
                        value={formState[category.id] || ""}
                        onChange={(e) => {
                          const value = e.target.value
                          setFormState(prev => ({
                            ...prev,
                            [category.id]: value
                          }))
                          // Aplikovat filtr automaticky při změně hodnoty po krátkém zpoždění
                          if (value) {
                            applyFilter(category.id, value)
                          } else {
                            // Když je hodnota prázdná, odstraníme filtr
                            setLocalFilters(filters => filters.filter(f => f.id !== category.id))
                          }
                        }}
                        placeholder={activeFilterValue || "Zadejte název pozice..."}
                        className="w-full h-8 !text-xs placeholder:!text-xs"
                      />
                    ) : (
                      // Pro ostatní filtry zobrazit Input s tlačítkem
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
                          className="w-full h-8 !text-xs placeholder:!text-xs"
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
          </div>
          
          {/* Seznam aktivních filtrů */}
          {localFilters.length > 0 && (
            <div className="flex flex-col gap-2 py-3 mb-2 border-b">
              <div className="text-sm font-medium mb-1">Aktivní filtry</div>
              <div className="flex flex-wrap gap-1">
                {localFilters.map((filter) => (
                  <Badge
                    key={`${filter.id}-${filter.value}`}
                    variant="accent"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="font-medium">{filter.label}:</span>{" "}
                    <span className="font-normal">{renderFilterValue(filter)}</span>
                    <button
                      className="h-3 w-3 cursor-pointer ml-1"
                      onClick={() => removeFilter(filter)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            Smazat pohled
          </Button>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              Počet náborů: <span className="text-xs font-normal">{getJobCountForCurrentFilters()}</span>
            </div>
            <Button type="submit" onClick={handleSave}>
              Uložit pohled
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 