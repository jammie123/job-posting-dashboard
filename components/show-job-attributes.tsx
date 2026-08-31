"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Import the useTableVisibility hook at the top
import { useTableVisibility } from "@/contexts/table-visibility-context"
import { GripVertical } from "lucide-react"

export interface JobAttribute {
  id: string
  label: string
}

// Keep order consistent with table and settings: actions, title, unreviewed, inProgress, invited, total, then others
const defaultAttributes: JobAttribute[] = [
  { id: "actions", label: "Akce" },
  { id: "title", label: "Název pozice" },
  { id: "unreviewed", label: "Neposouzený" },
  { id: "inProgress", label: "Ve hře" },
  { id: "invited", label: "Pozvaný" },
  { id: "total", label: "Celkem" },
  { id: "status", label: "Stav" },
  { id: "location", label: "Lokalita" },
  { id: "recruiter", label: "Náborář" },
  { id: "advertisement", label: "Inzerce" },
  { id: "dateCreated", label: "Datum vytvoření" },
  { id: "views", label: "Shlédnutí" },
  { id: "note", label: "Poznámka" },
  { id: "hired", label: "Nástup" },
  { id: "rejected", label: "Zamítnutí" },
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
  const { visibleColumns, setVisibleColumns, columnOrder, setColumnOrder } = useTableVisibility()
  const [isOpen, setIsOpen] = React.useState(false)

  // Remove the isInitialMount ref and useEffect since we're now using context

  const handleCheckedChange = (checked: boolean, attributeId: string) => {
    const pinnedColumns = ["actions", "title"]
    if (!checked && pinnedColumns.includes(attributeId)) {
      return
    }
    const newSelected = checked ? [...visibleColumns, attributeId] : visibleColumns.filter((id) => id !== attributeId)
    setVisibleColumns(newSelected)
  }

  // Order attributes according to current columnOrder
  const attributesInOrder = React.useMemo(() => {
    const orderIndex = Object.fromEntries(columnOrder.map((id, idx) => [id, idx])) as Record<string, number>
    const pinned = ["actions", "title"]
    const preferred = ["unreviewed", "inProgress", "invited", "total"]

    const attrs = [...defaultAttributes]
    const pinnedAttrs = attrs.filter((a) => pinned.includes(a.id))
    const others = attrs.filter((a) => !pinned.includes(a.id))

    const sortedOthers = others.sort((a, b) => {
      const ai = preferred.indexOf(a.id)
      const bi = preferred.indexOf(b.id)
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
      return (orderIndex[a.id] ?? 999) - (orderIndex[b.id] ?? 999)
    })

    return [...pinnedAttrs, ...sortedOthers]
  }, [columnOrder])

  const draggingIdRef = React.useRef<string | null>(null)
  const pinnedColumns = React.useMemo(() => ["actions", "title"], [])

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    draggingIdRef.current = id
    e.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    const sourceId = draggingIdRef.current
    draggingIdRef.current = null
    if (!sourceId || sourceId === targetId) return
    if (pinnedColumns.includes(sourceId)) return
    const currentOrder = [...columnOrder]
    const sourceIndex = currentOrder.indexOf(sourceId)
    const targetIndex = currentOrder.indexOf(targetId)
    if (sourceIndex === -1 || targetIndex === -1) return
    currentOrder.splice(sourceIndex, 1)
    currentOrder.splice(targetIndex, 0, sourceId)
    // Enforce pinned columns first and deduplicate
    const unique = Array.from(new Set(currentOrder))
    const others = unique.filter((id) => !pinnedColumns.includes(id))
    const normalized = [...pinnedColumns, ...others]
    setColumnOrder(normalized)
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
            <div className="grid gap-2">
              {attributesInOrder.map((attribute) => (
                <div
                  key={attribute.id}
                  className={`group flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-muted ${
                    pinnedColumns.includes(attribute.id) ? "cursor-not-allowed" : "cursor-grab"
                  }`}
                  draggable={!pinnedColumns.includes(attribute.id)}
                  onDragStart={(e) => {
                    if (pinnedColumns.includes(attribute.id)) return
                    onDragStart(e, attribute.id)
                  }}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, attribute.id)}
                >
                  <span
                    className={`opacity-0 group-hover:opacity-100 text-muted-foreground ${
                      pinnedColumns.includes(attribute.id) ? "opacity-50" : ""
                    }`}
                    aria-hidden
                    title={pinnedColumns.includes(attribute.id) ? "Tento sloupec nelze přesouvat" : undefined}
                  >
                    <GripVertical size={16} />
                  </span>
                  <Checkbox
                    id={attribute.id}
                    checked={visibleColumns.includes(attribute.id)}
                    onCheckedChange={(checked) => handleCheckedChange(checked as boolean, attribute.id)}
                    disabled={pinnedColumns.includes(attribute.id)}
                  />
                  <Label
                    htmlFor={attribute.id}
                    className={`text-sm font-normal leading-none ${
                      pinnedColumns.includes(attribute.id)
                        ? "opacity-60 cursor-not-allowed"
                        : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    }`}
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

