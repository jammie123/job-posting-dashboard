"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowDownAZ, ArrowUpAZ, CalendarClock, CalendarX, ListFilter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export type SortOption = "title-asc" | "title-desc" | "created-asc" | "created-desc" | "expires-asc" | "expires-desc"

interface SortMenuProps {
  onSortChange?: (option: SortOption) => void
  currentSort?: SortOption
}

export function SortMenu({ onSortChange, currentSort = "created-desc" }: SortMenuProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (option: SortOption) => {
    onSortChange?.(option)
    setOpen(false)
  }

  const getSortLabel = () => {
    switch (currentSort) {
      case "created-desc":
        return "Datum vytvoření (nejnovější)"
      case "created-asc":
        return "Datum vytvoření (nejstarší)"

      case "title-desc":
        return "Název náboru (Z-A)"

      case "expires-asc":
        return "Datum ukončení (nejdříve)"
      case "expires-desc":
        return "Datum ukončení (nejpozději)"
      default:
        return "Datum vytvoření (nejnovější)"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto font-normal"
        >
          <ListFilter className="h-4 w-4" />
          <span>{getSortLabel()}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => handleSelect("created-desc")}>
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>Datum vytvoření (nejnovější)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("created-asc")}>
          <CalendarClock className="mr-2 h-4 w-4" />
          <span>Datum vytvoření (nejstarší)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSelect("title-asc")}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          <span>Název náboru (A-Z)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("title-desc")}>
          <ArrowUpAZ className="mr-2 h-4 w-4" />
          <span>Název náboru (Z-A)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSelect("expires-asc")}>
          <CalendarX className="mr-2 h-4 w-4" />
          <span>Datum ukončení (nejdříve)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect("expires-desc")}>
          <CalendarX className="mr-2 h-4 w-4" />
          <span>Datum ukončení (nejpozději)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

