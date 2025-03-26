"use client"

import type React from "react"

import { useState } from "react"
import { LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ShowJobAttributes } from "@/components/show-job-attributes"

// Import the useTableVisibility hook
import { useTableVisibility } from "@/contexts/table-visibility-context"

type ViewType = "cards" | "table"

interface SettingTableViewProps {
  onViewChange?: (view: ViewType) => void
  currentView?: ViewType
  trigger?: React.ReactNode
}

//Mock data
const defaultAttributes: JobAttribute[] = [
  { id: "actions", label: "Akce" },
  { id: "title", label: "Název pozice" },
  { id: "status", label: "Status" },
  { id: "location", label: "Lokalita" },
  { id: "recruiter", label: "Náborář" },
  { id: "advertisement", label: "Inzerce" },
  { id: "unreviewed", label: "Neposouzený" },
  { id: "inProgress", label: "Ve hře" },
  { id: "hired", label: "Nástup" },
  { id: "rejected", label: "Zamítnutí" },
  { id: "total", label: "Celkem kandidátů" },
  { id: "dateCreated", label: "Datum vytvoření" },
  { id: "views", label: "Shlédnutí" },
  { id: "note", label: "Poznámka" },
]

// Update the component to use the context
export function SettingTableView({ onViewChange, currentView = "cards", trigger }: SettingTableViewProps) {
  const [view, setView] = useState<ViewType>(currentView)
  const [open, setOpen] = useState(false)
  const { visibleColumns } = useTableVisibility()

  const handleViewChange = (value: ViewType) => {
    if (!value) return
    setView(value)
    onViewChange?.(value)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            {view === "cards" ? <LayoutGrid className="h-4 w-4" /> : <Table className="h-4 w-4" />}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <div className="px-2 py-3">
          <DropdownMenuLabel className="text-sm font-medium mb-3">Zobrazit jako</DropdownMenuLabel>
          <ToggleGroup type="single" value={view} onValueChange={handleViewChange} className="flex justify-start gap-2">
            <ToggleGroupItem
              value="cards"
              aria-label="Zobrazit jako karty"
              className="flex items-center gap-2 data-[state=on]:bg-gray-100 dark:data-[state=on]:bg-gray-800"
            >
              <LayoutGrid className="h-4 w-4" />
              Karty
            </ToggleGroupItem>
            <ToggleGroupItem
              value="table"
              aria-label="Zobrazit jako tabulku"
              className="flex items-center gap-2 data-[state=on]:bg-gray-100 dark:data-[state=on]:bg-gray-800"
              onClick={() => onViewChange?.("table")}
            >
              <Table className="h-4 w-4" />
              Tabulka
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-3">
          <DropdownMenuLabel className="text-sm font-medium mb-3">Vybrat sloupce</DropdownMenuLabel>
          <ShowJobAttributes
            onTriggerClick={() => setOpen(false)}
            trigger={
              <Button variant="outline" className="w-full justify-start text-sm">
                {visibleColumns.length} zobrazených, {defaultAttributes.length - visibleColumns.length} skrytých
              </Button>
            }
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

