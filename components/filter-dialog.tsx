"use client"

import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const filterOptions = [
  {
    category: "Stav náboru",
    options: [
      { value: "Aktivní", label: "Zveřejněný" },
      { value: "Neaktivní", label: "Nezveřejněný" },
      { value: "Interní", label: "Interní" },
      { value: "Archivovaný", label: "Archivní" },
    ],
  },
  {
    category: "Zapojený uživatel",
    options: ["Martin Novotný", "Tereza Dvořáková", "Jan Dvořák", "Pavel Černý"],
  },
  {
    category: "Lokalita",
    options: ["Praha", "Brno", "Ostrava", "Remote"],
  },
  {
    category: "Místo vystavení",
    options: ["LinkedIn", "Facebook", "Firemní web", "Jobs.cz", "Práce.cz", "Intranet"],
  },
  {
    category: "Stav inzerátu",
    options: ["Aktivní", "Ukončený", "Čeká na schválení"],
  },
  {
    category: "Datum vytvoření náboru",
    options: ["Dnes", "Tento týden", "Tento měsíc", "Tento rok"],
  },
  {
    category: "Datum ukončení inzerátu",
    options: ["Tento týden", "Příští týden", "Tento měsíc", "Příští měsíc"],
  },
]

interface FilterDialogProps {
  children: React.ReactNode
  onFilterSelect?: (category: string, option: string) => void
}

export function FilterDialog({ children, onFilterSelect }: FilterDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[325px]">
        <div className="grid p-1">
          {filterOptions.map((category) => (
            <Button
              key={category.category}
              variant="ghost"
              className="justify-start font-medium"
              onClick={() => {
                onFilterSelect?.(category.category, "")
                setOpen(false)
              }}
            >
              {category.category}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

