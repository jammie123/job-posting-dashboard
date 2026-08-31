"use client"

import { useState } from "react"
import { CheckSquare, PanelsTopLeft } from "lucide-react"
import { SortMenu, type SortOption } from "@/components/sort-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SettingTableView } from "@/components/setting-table-view"
import { RepublishAdvertsimentModal } from "./republish-advertisment-modal"
import { BulkRepublishModal } from "./bulk-republish-modal"
import { BulkExtendModal } from "./bulk-extend-modal"
import { BulkCancelAdvert } from "./bulk-cancel-advert"
import { useToast } from "./ui/use-toast"
import type { JobPosting } from "@/types/job-posting"

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
  selectedJobs?: JobPosting[] // Přidáváme selectedJobs pro přístup k datům vybraných inzerátů
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
  selectedJobs = [],
}: PostingActionsProps) {
  const [currentSort, setCurrentSort] = useState<SortOption>("title-asc")
  const [bulkActionEnabled, setBulkActionEnabled] = useState(false)
  const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false)
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false)
  const [isCancelAdvertModalOpen, setIsCancelAdvertModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSortChange = (option: SortOption) => {
    setCurrentSort(option)
    onSortChange?.(option)
  }

  const toggleBulkAction = () => {
    const newState = !bulkActionEnabled
    setBulkActionEnabled(newState)
    onBulkActionToggle?.(newState)
  }

  const handleRepublishConfirm = (selectedPortals: string[], updatedPortals?: any) => {
    setIsRepublishModalOpen(false)
    
    if (selectedPortals.length === 0) return;
    
    // Pokud máme aktualizovaná data portálů, můžeme je zde zpracovat
    if (updatedPortals) {
      console.log("Updated portals data:", updatedPortals);
      // V reálné aplikaci bychom zde aktualizovali stav nebo volali API
    }
    
    // Informace o úspěšném znovuvystavení
    toast({
      title: "Inzeráty znovuvystaveny",
      description: `${selectedCount} ${selectedCount === 1 ? "inzerát byl" : "inzeráty byly"} úspěšně znovuvystaven${selectedCount === 1 ? "" : "y"} na ${selectedPortals.length} ${selectedPortals.length === 1 ? "portálu" : "portálech"}.`,
    })
  }

  const handleExtendConfirm = (selectedPortals: string[]) => {
    setIsExtendModalOpen(false)
    
    if (selectedPortals.length === 0) return;
    
    // Informace o úspěšném prodloužení
    toast({
      title: "Inzeráty prodlouženy",
      description: `${selectedCount} ${selectedCount === 1 ? "inzerát byl" : "inzeráty byly"} úspěšně prodloužen${selectedCount === 1 ? "" : "y"} na ${selectedPortals.length} ${selectedPortals.length === 1 ? "portálu" : "portálech"}.`,
    })
  }

  const handleCancelAdvertConfirm = (selectedPortals: string[]) => {
    setIsCancelAdvertModalOpen(false)
    
    if (selectedPortals.length === 0) return;
    
    // Informace o úspěšném ukončení vystavení
    toast({
      title: "Vystavení inzerátů ukončeno",
      description: `${selectedPortals.length} ${selectedPortals.length === 1 ? "místo bylo" : "místa byla"} úspěšně ukončeno.`,
    })
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
    <div className={`flex flex-row  justify-between flex-wrap transition-all duration-500 ease-in-out transform ${bulkActionEnabled ? 'sticky top-2 z-10' : 'px-4'}`}>
      {bulkActionEnabled ? (
        <div className={`flex items-center justify-between bg-gray-50 rounded-md shadow-lg mb-4 px-4 py-2 w-full transition-all duration-500 ease-in-out transform translate-x-0 z-10`}>
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
                <div className="flex gap-2 ml-4 flex-wrap">
                  <Button size="sm" variant="outline">
                    Archivovat nábor
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsCancelAdvertModalOpen(true)}
                  >
                    Ukončit vystavení
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsRepublishModalOpen(true)}
                  >
                    Znovuvystavit inzeráty
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setIsExtendModalOpen(true)}
                  >
                    Prodloužit inzeráty
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
        <div className="flex items-center justify-between">
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

      {/* Modály pro znovuvystavení inzerátů */}
      {selectedCount === 1 && selectedJobs && selectedJobs.length === 1 && selectedJobs[0]?.advertisement?.portals && (
        <RepublishAdvertsimentModal
          open={isRepublishModalOpen}
          onOpenChange={setIsRepublishModalOpen}
          portals={selectedJobs[0].advertisement.portals}
          jobId={selectedJobs[0].id}
          onConfirm={handleRepublishConfirm}
        />
      )}

      {selectedCount > 1 && selectedJobs && selectedJobs.length > 1 && (
        <BulkRepublishModal
          open={isRepublishModalOpen}
          onOpenChange={setIsRepublishModalOpen}
          selectedJobs={selectedJobs}
          onConfirm={handleRepublishConfirm}
        />
      )}

      {/* Modály pro prodloužení inzerátů */}
      {selectedCount > 0 && selectedJobs && selectedJobs.length > 0 && (
        <BulkExtendModal
          open={isExtendModalOpen}
          onOpenChange={setIsExtendModalOpen}
          selectedJobs={selectedJobs}
          onConfirm={handleExtendConfirm}
        />
      )}

      {/* Modál pro ukončení vystavení inzerátů */}
      {selectedCount > 0 && selectedJobs && selectedJobs.length > 0 && (
        <BulkCancelAdvert
          open={isCancelAdvertModalOpen}
          onOpenChange={setIsCancelAdvertModalOpen}
          selectedJobs={selectedJobs}
          onConfirm={handleCancelAdvertConfirm}
        />
      )}
    </div>
  )
}

