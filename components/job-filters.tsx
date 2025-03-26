"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Plus, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FilterDialog } from "@/components/filter-dialog"
import { RecruiterFilter } from "@/components/recruiter-filter"
import { CreateViewDialog } from "./create-view-dialog"

export type FilterOption = {
  id: string
  label: string
  options: string[]
}

export const filterOptions: FilterOption[] = [
  {
    id: "status",
    label: "Stav náboru",
    options: ["Zveřejněný", "Nezveřejněný", "Interní", "Archivovaný"],
  },
  {
    id: "recruiter",
    label: "Náborář",
    options: [
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
    ],
  },
  {
    id: "involved",
    label: "Zapojený uživatel",
    options: ["Martin Novotný", "Tereza Dvořáková", "Jan Dvořák", "Pavel Černý"],
  },
  {
    id: "adStatus",
    label: "Stav inzerátu",
    options: ["Aktivní", "Ukončený", "Čeká na schválení"],
  },
  {
    id: "portal",
    label: "Místo vystavení",
    options: ["LinkedIn", "Facebook", "Firemní web", "Jobs.cz", "Práce.cz", "Intranet"],
  },
  {
    id: "location",
    label: "Lokalita",
    options: ["Praha", "Brno", "Ostrava", "Remote"],
  },
  {
    id: "createDate",
    label: "Datum vytvoření náboru",
    options: ["Dnes", "Tento týden", "Tento měsíc", "Tento rok"],
  },
  {
    id: "endDate",
    label: "Datum ukončení inzerátu",
    options: ["Tento týden", "Příští týden", "Tento měsíc", "Příští měsíc"],
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

  const handleFilterSelect = (filter: ActiveFilter, value: string) => {
    onFilterChange(activeFilters.map((f) => (f.id === filter.id ? { ...f, value } : f)))
  }

  const removeFilter = (filterId: string, value: string) => {
    onFilterChange(activeFilters.filter((f) => !(f.id === filterId && f.value === value)))
  }

  const handleSaveView = (viewName: string) => {
    console.log("Saving view:", viewName, "with filters:", activeFilters)
    // Here you would typically save the view to your backend or local storage
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hledat podle názvu pozice..."
            className="pl-9"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <RecruiterFilter onRecruiterChange={onRecruiterChange} />
        <FilterDialog
          onFilterSelect={(category, option) => {
            const filterOption = filterOptions.find((f) => f.label === category)
            if (filterOption) {
              onFilterChange([...activeFilters, { id: filterOption.id, label: category, value: option }])
            }
          }}
        >
          <Button variant="outline" className="gap-0">
            <Plus className="h-4 w-4 mr-2" />
            Přidat filtr
          </Button>
        </FilterDialog>
        {activeFilters.length > 0 && (
          <Button variant="link" className="gap-2 text-primary" onClick={() => setCreateViewOpen(true)}>
            <Save className="h-4 w-4" />
            Vytvořit nový pohled
          </Button>
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
                    {filterOptions
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

