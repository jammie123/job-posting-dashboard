"use client"

import { useState } from "react"
import { CheckSquare, PanelsTopLeft } from "lucide-react"
import { SortMenu, type SortOption } from "@/components/sort-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SettingTableView } from "@/components/setting-table-view"

interface PostingActionsProps {
  visibleCount: number
  selectedCount: number // Make this required
  onSortChange?: (option: SortOption) => void
  onBulkActionToggle?: (enabled: boolean) => void
  hideCounts?: boolean
  onSelectAll?: (checked: boolean) => void
  viewType?: "cards" | "table"
  onViewChange?: (view: "cards" | "table") => void
  activeView?: string
}

export function PostingActions({
  visibleCount,
  onSortChange,
  onBulkActionToggle,
  hideCounts = false,
  viewType = "cards",
  onViewChange,
  onSelectAll,
  selectedCount,
  activeView,
}: PostingActionsProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>("title-asc")
  const [bulkActionEnabled, setBulkActionEnabled] = useState(false)

  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option)
    onSortChange?.(option)
  }

  const toggleBulkAction = () => {
    const newState = !bulkActionEnabled
    setBulkActionEnabled(newState)
    onBulkActionToggle?.(newState)
  }

  // Get the appropriate label based on the active view
  const getViewLabel = () => {
    switch (activeView) {
      case "active":
        return "zveřejněných pozic"
      case "inactive":
        return "nezveřejněných pozic"
      case "internal":
        return "interních pozic"
      case "archive":
        return "archivních pozic"
      case "open":
        return "otevřených pozic"
      default:
        return visibleCount === 1 ? "pozice" : "pozic"
    }
  }

  return (
    <div className="flex flex-row justify-between flex-wrap transition-all duration-500 ease-in-out transform">
      {bulkActionEnabled ? (
        <div className="flex items-center justify-between bg-white rounded-md shadow-md px-4 mb-4 py-2 w-full transition-all duration-500 ease-in-out transform translate-x-0">
          <div className="flex items-center w-full justify-between">
            <div className="text-sm text-primary font-medium flex gap-4 items-center">
              <Checkbox
                id="select-all"
                checked={selectedCount === visibleCount && visibleCount > 0}
                onCheckedChange={(checked) => {
                  onSelectAll?.(!!checked)
                }}
              />
              {visibleCount} {getViewLabel()}
              {bulkActionEnabled && selectedCount > 0 && ` (${selectedCount} vybráno)`}
              {selectedCount > 0 && (
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    Archivovat nábor
                  </Button>
                  <Button size="sm" variant="outline">
                    Ukončit inzeráty
                  </Button>
                  <Button size="sm" variant="outline">
                    Předat nábor
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              className={`flex items-center gap-2 text-sm px-2 py-1 font-normal ${
                bulkActionEnabled
                  ? "text-foreground bg-gray-100 dark:bg-gray-800"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
              onClick={toggleBulkAction}
            >
              <CheckSquare className="h-4 w-4" />
              <span>{bulkActionEnabled ? "Vypnout hromadné akce" : "Hromadné akce"}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {visibleCount} {getViewLabel()}
            </div>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm px-2 py-1 font-normal text-muted-foreground hover:text-foreground transition-colors"
              onClick={toggleBulkAction}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Hromadné akce</span>
            </Button>
          </div>
        </div>
      )}
      <div
        className={`flex items-center justify-end gap-6 transition-all duration-250 ease-in-out transform ${
          bulkActionEnabled ? "opacity-0" : "opacity-100"
        }`}
      >
        <SortMenu currentSort={currentSort} onSortChange={handleSortChange} />
        <SettingTableView
          currentView={viewType}
          onViewChange={onViewChange}
          trigger={
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto font-normal"
            >
              <PanelsTopLeft className="h-4 w-4" />
              <span>Zobrazit informace</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}

