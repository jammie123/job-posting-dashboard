"use client"

import type React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { filterOptions } from "./job-filters"

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
            <DropdownMenuSub key={category.id}>
              <DropdownMenuSubTrigger className="px-2 py-1.5 text-sm font-medium">
                {category.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-[200px]">
                {category.options.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      onFilterSelect?.(category.label, option)
                      setOpen(false)
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

