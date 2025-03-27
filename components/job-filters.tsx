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
  value: string | string[]
  isMulti?: boolean
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
    
    // Pro filtr adStatus podporujeme vícenásobný výběr
    if (filter.id === "adStatus" && filter.isMulti) {
      // Pokud je již hodnota polem, přidáme nebo odebereme hodnotu
      if (Array.isArray(filter.value)) {
        let newValues: string[];
        
        // Pokud již hodnota existuje, odebereme ji, jinak přidáme
        if (filter.value.includes(value)) {
          newValues = filter.value.filter(v => v !== value);
        } else {
          newValues = [...filter.value, value];
        }
        
        // Pokud je výsledné pole prázdné, odstraníme celý filtr
        if (newValues.length === 0) {
          const updatedFilters = activeFilters.filter((f) => f.id !== filter.id);
          onFilterChange(updatedFilters);
          return;
        }
        
        // Aktualizujeme filtr s novým polem hodnot
        const updatedFilters = activeFilters.map((f) => 
          f.id === filter.id ? { ...f, value: newValues } : f
        );
        onFilterChange(updatedFilters);
      } else {
        // Pokud hodnota není pole, vytvoříme nové pole s aktuální a novou hodnotou
        const newValues = filter.value ? [filter.value, value] : [value];
        const updatedFilters = activeFilters.map((f) => 
          f.id === filter.id ? { ...f, value: newValues } : f
        );
        onFilterChange(updatedFilters);
      }
    } else {
      // Pro ostatní filtry pouze aktualizujeme hodnotu
      const updatedFilters = activeFilters.map((f) => 
        f.id === filter.id ? { ...f, value } : f
      );
      onFilterChange(updatedFilters);
    }
  }

  const removeFilter = (filterId: string, value?: string) => {
    if (value === undefined) {
      console.log(`Odstraňuji celý filtr: ${filterId}`);
      // Pokud hodnota není specifikována, odstraníme celý filtr
      const updatedFilters = activeFilters.filter((f) => f.id !== filterId);
      onFilterChange(updatedFilters);
      return;
    }
    
    console.log(`Odstraňuji filtr: ${filterId} = ${value}`);
    
    // Pro filtr typu MultiSelect, odebereme pouze konkrétní hodnotu z pole
    const filter = activeFilters.find(f => f.id === filterId);
    if (filter && Array.isArray(filter.value) && filter.isMulti) {
      const newValues = filter.value.filter(v => v !== value);
      
      // Pokud je pole prázdné, odstraníme celý filtr
      if (newValues.length === 0) {
        const updatedFilters = activeFilters.filter((f) => f.id !== filterId);
        onFilterChange(updatedFilters);
      } else {
        // Jinak aktualizujeme pole hodnot
        const updatedFilters = activeFilters.map((f) => 
          f.id === filterId ? { ...f, value: newValues } : f
        );
        onFilterChange(updatedFilters);
      }
    } else {
      // Pro běžné filtry odstraníme celý filtr
      const updatedFilters = activeFilters.filter((f) => !(f.id === filterId && f.value === value));
      onFilterChange(updatedFilters);
    }
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
        // Pro adStatus nastavíme isMulti=true a zachováme současnou hodnotu
        if (filterOption.id === "adStatus") {
          if (Array.isArray(newFilters[existingFilterIndex].value)) {
            // Pokud již je hodnota pole a obsahuje vybranou hodnotu, neděláme nic
            if (!newFilters[existingFilterIndex].value.includes(option)) {
              newFilters[existingFilterIndex] = { 
                ...newFilters[existingFilterIndex], 
                value: [...newFilters[existingFilterIndex].value as string[], option],
                isMulti: true
              };
            }
          } else {
            // Pokud hodnota není pole, převedeme ji na pole s novou hodnotou
            const currentValue = newFilters[existingFilterIndex].value as string;
            newFilters[existingFilterIndex] = { 
              ...newFilters[existingFilterIndex], 
              value: currentValue ? [currentValue, option] : [option],
              isMulti: true
            };
          }
        } else {
          // Aktualizace existujícího filtru pro ostatní typy
          newFilters[existingFilterIndex] = { 
            ...newFilters[existingFilterIndex], 
            value: option 
          };
        }
      } else {
        // Přidání nového filtru, pro adStatus s isMulti=true
        newFilters.push({ 
          id: filterOption.id, 
          label: category, 
          value: filterOption.id === "adStatus" ? [option] : option,
          isMulti: filterOption.id === "adStatus"
        });
      }
      
      onFilterChange(newFilters);
    }
  }

  // Helper pro zobrazení hodnoty filtru
  const renderFilterValue = (filter: ActiveFilter) => {
    if (Array.isArray(filter.value)) {
      return filter.value.join(", ");
    }
    return filter.value;
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
          initialValue={activeFilters.find(f => f.id === "recruiter")?.value as string || ""}
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
              className="gap-2 text-primary" 
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
              <Badge 
                variant="secondary" 
                className="rounded-full px-3 py-1 cursor-pointer"
                onClick={() => {
                  // Pokud je to filtr adStatus, zobrazíme/skryjeme dropdown s možnostmi
                  if (filter.id === "adStatus") {
                    const filterElement = document.getElementById(`filter-${filter.id}-${index}`);
                    if (filterElement) {
                      filterElement.classList.toggle("hidden");
                    }
                  }
                }}
              >
                {filter.label}
                {filter.value && `: ${renderFilterValue(filter)}`}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation(); // Zastavíme propagaci události, aby se nespustilo zobrazení/skrytí dropdownu
                    removeFilter(filter.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
              
              {/* Pro filtr adStatus vždy zobrazíme možnosti, které budou skryté dokud uživatel neklikne na badge */}
              {filter.id === "adStatus" && (
                <div 
                  id={`filter-${filter.id}-${index}`}
                  className="absolute left-0 top-full mt-1 w-48 p-2 rounded-md border bg-popover shadow-md z-10 hidden"
                >
                  <div className="grid gap-1">
                    {dynamicFilterOptions
                      .find((f) => f.id === filter.id)
                      ?.options.map((option) => {
                        // Pro vícenásobný výběr zobrazíme, které hodnoty jsou již vybrané
                        const isSelected = Array.isArray(filter.value) ? 
                          filter.value.includes(option) : 
                          filter.value === option;
                            
                        return (
                          <Button
                            key={option}
                            variant={isSelected ? "default" : "ghost"}
                            className={`justify-start px-2 h-8 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterSelect(filter, option);
                            }}
                          >
                            {option}
                          </Button>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {/* Pro ostatní filtry zachováme původní logiku - dropdown jen když hodnota je prázdná */}
              {!filter.value && filter.id !== "adStatus" && (
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

