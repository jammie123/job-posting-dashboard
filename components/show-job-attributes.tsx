"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Import the useTableVisibility hook at the top
import { useTableVisibility } from "@/contexts/table-visibility-context"

export interface JobAttribute {
  id: string
  label: string
}

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

interface ShowJobAttributesProps {
  trigger?: React.ReactNode
  onTriggerClick?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

// Update the ShowJobAttributes component to use the context
export function ShowJobAttributes({
  trigger,
  onTriggerClick,
  open,
  onOpenChange,
  hideTrigger = false,
}: ShowJobAttributesProps) {
  // Replace the local state with the context
  const { visibleColumns, setVisibleColumns } = useTableVisibility()
  const [isOpen, setIsOpen] = React.useState(false)

  // Remove the isInitialMount ref and useEffect since we're now using context

  const handleCheckedChange = (checked: boolean, attributeId: string) => {
    const newSelected = checked ? [...visibleColumns, attributeId] : visibleColumns.filter((id) => id !== attributeId)
    setVisibleColumns(newSelected)
  }

  return (
    <DropdownMenu open={open !== undefined ? open : isOpen} onOpenChange={onOpenChange || setIsOpen}>
      <DropdownMenuTrigger
        asChild
        className={hideTrigger ? "hidden" : ""}
        onClick={() => {
          onTriggerClick?.()
          if (open === undefined) {
            setIsOpen(true)
          }
        }}
      >
        {trigger || (
          <Button variant="outline" className="w-full justify-start text-sm">
            {visibleColumns.length} zobrazených, {defaultAttributes.length} skrytých
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[425px]">
        <div className="px-4 py-3">
          <h3 className="text-sm font-medium mb-3">Zobrazené sloupce</h3>
          <ScrollArea className="h-[300px] pr-4">
            <div className="grid gap-4">
              {defaultAttributes.map((attribute) => (
                <div key={attribute.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={attribute.id}
                    checked={visibleColumns.includes(attribute.id)}
                    onCheckedChange={(checked) => handleCheckedChange(checked as boolean, attribute.id)}
                  />
                  <Label
                    htmlFor={attribute.id}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {attribute.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

