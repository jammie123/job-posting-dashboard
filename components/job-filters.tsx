"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Plus, Save, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterDialog } from "@/components/filter-dialog"
import { RecruiterFilter } from "@/components/recruiter-filter"
import { CreateViewDialog } from "./create-view-dialog"
import { JobStatus } from "@/types/job-posting"

export type FilterOption = {
  id: string
  label: string
  options: string[]
}

// Aktualizovány možnosti filtrů podle dat v mock-jobs.json
export const filterOptions: FilterOption[] = [
  {
    id: "status",
    label: "Stav náboru",
    options: ["Aktivní", "Rozpracovaný", "Archivní"],
  },
  {
    id: "recruiter",
    label: "Náborář",
    options: [
      "Anna Kovářová",
      "Martin Horák",
      "Lucie Svobodová",
    ],
  },
  {
    id: "location",
    label: "Lokalita",
    options: ["Praha", "Brno", "Ostrava", "Remote"],
  },
  {
    id: "adStatus",
    label: "Stav inzerátu",
    options: ["Vystavený", "Ukončený", "Nevystavený"],
  },
  {
    id: "portal",
    label: "Místo vystavení",
    options: ["jobs.cz", "linkedin.com", "práce.cz"],
  },
]

export type ActiveFilter = {
  id: string
  label: string
  value: string
}

interface JobFiltersProps {
  onSearchChange: (value: string) => void
  searchValue: string
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onRecruiterChange?: (value: string) => void
}

export function JobFilters({
  onSearchChange,
  searchValue,
  activeFilters,
  onFilterChange,
  onRecruiterChange,
}: JobFiltersProps) {
  const [createViewOpen, setCreateViewOpen] = useState(false)
  
  // Přidán stav pro uložení možností filtrů načtených z dat
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState<FilterOption[]>(filterOptions)

  // Efekt pro logování stavu filtrů při každé změně
  useEffect(() => {
    console.log("Aktuální stav filtrovacích možností:", dynamicFilterOptions);
    console.log("Aktuální aktivní filtry:", activeFilters);
  }, [dynamicFilterOptions, activeFilters]);

  const handleFilterSelect = (filter: ActiveFilter, value: string) => {
    console.log(`Vybírám hodnotu pro filtr: ${filter.id} = ${value}`);
    // Vytvoření nové kolekce filtrů s aktualizovanou hodnotou
    const updatedFilters = activeFilters.map((f) => 
      f.id === filter.id ? { ...f, value } : f
    );
    onFilterChange(updatedFilters);
  }

  const removeFilter = (filterId: string, value: string) => {
    console.log(`Odstraňuji filtr: ${filterId} = ${value}`);
    // Vytvoření nové kolekce filtrů bez odstraněného filtru
    const updatedFilters = activeFilters.filter((f) => !(f.id === filterId && f.value === value));
    onFilterChange(updatedFilters);
  }

  const handleSaveView = (viewName: string) => {
    console.log("Ukládám pohled:", viewName, "s filtry:", activeFilters);
    // Zde byste typicky uložili pohled do backendu nebo local storage
  }

  const clearAllFilters = () => {
    console.log("Odstraňuji všechny filtry");
    onFilterChange([]);
  }

  const handleAddFilter = (category: string, option: string) => {
    console.log(`Přidávám filtr: ${category} = ${option}`);
    const filterOption = filterOptions.find((f) => f.label === category);
    if (filterOption) {
      // Kontrola, zda podobný filtr již existuje
      const existingFilterIndex = activeFilters.findIndex(f => f.id === filterOption.id);
      
      let newFilters = [...activeFilters];
      
      if (existingFilterIndex >= 0) {
        // Aktualizace existujícího filtru
        newFilters[existingFilterIndex] = { 
          ...newFilters[existingFilterIndex], 
          value: option 
        };
      } else {
        // Přidání nového filtru
        newFilters.push({ 
          id: filterOption.id, 
          label: category, 
          value: option 
        });
      }
      
      onFilterChange(newFilters);
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat podle názvu pozice..."
            className="pl-9"
            value={searchValue}
            onChange={(e) => {
              console.log(`Vyhledávací dotaz: "${e.target.value}"`);
              onSearchChange(e.target.value);
            }}
          />
        </div>
        
        <RecruiterFilter 
          onRecruiterChange={(value) => {
            console.log(`Filtr náboráře: "${value}"`);
            if (onRecruiterChange) onRecruiterChange(value);
          }} 
        />
        
        <FilterDialog
          onFilterSelect={handleAddFilter}
        >
          <Button variant="outline" className="gap-0">
            <Plus className="h-4 w-4 mr-2" />
            Přidat filtr
          </Button>
        </FilterDialog>
        
        {activeFilters.length > 0 && (
          <>
            <Button 
              variant="ghost" 
              className="gap-2 text-destructive" 
              onClick={clearAllFilters}
            >
              <X className="h-4 w-4" />
              Vymazat filtry
            </Button>
            
            <Button 
              variant="link" 
              className="gap-2 text-primary" 
              onClick={() => setCreateViewOpen(true)}
            >
              <Save className="h-4 w-4" />
              Uložit pohled
            </Button>
          </>
        )}
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div key={`${filter.id}-${index}`} className="relative">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {filter.label}
                {filter.value && `: ${filter.value}`}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={() => removeFilter(filter.id, filter.value)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
              {!filter.value && (
                <div className="absolute left-0 top-full mt-1 w-48 p-2 rounded-md border bg-popover shadow-md z-10">
                  <div className="grid gap-1">
                    {dynamicFilterOptions
                      .find((f) => f.id === filter.id)
                      ?.options.map((option) => (
                        <Button
                          key={option}
                          variant="ghost"
                          className="justify-start px-2 h-8"
                          onClick={() => handleFilterSelect(filter, option)}
                        >
                          {option}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateViewDialog
        open={createViewOpen}
        onOpenChange={setCreateViewOpen}
        activeFilters={activeFilters}
        onSave={handleSaveView}
      />
    </div>
  )
}

