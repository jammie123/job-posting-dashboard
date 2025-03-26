"use client"

import { useState } from "react"
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
import type { ActiveFilter } from "./job-filters"
import { Badge } from "@/components/ui/badge"

interface CreateViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeFilters: ActiveFilter[]
  onSave: (viewName: string) => void
}

export function CreateViewDialog({ open, onOpenChange, activeFilters, onSave }: CreateViewDialogProps) {
  const [viewName, setViewName] = useState("")

  const handleSave = () => {
    if (viewName.trim()) {
      onSave(viewName)
      setViewName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Vytvořit nový pohled</DialogTitle>
          <DialogDescription>Pojmenujte si svůj pohled a uložte se aktuální nastavení filtrů</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="w-full items-start gap-4">
            <Input
              id="name"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="col-span-3"
              placeholder="Můj pohled"
              autoFocus
            />
          </div>
          {activeFilters.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="col-span-3 flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="px-1 py-1">
                    <div>{filter.label}:</div> {filter.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Uložit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

