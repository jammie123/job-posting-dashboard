"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Info } from "lucide-react"
import { JobStatus } from "@/types/job-posting"
import { CreateViewDialog } from "./create-view-dialog"
import { ActiveFilter } from "./job-filters"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export interface JobViewConfig {
  value: string
  label: string
  filters?: {
    [key: string]: any
  }
}

interface JobViewsProps {
  onViewChange?: (value: string) => void
  activeView?: string
  counts: Record<string, number>
  isEshop?: boolean
  activeFilters?: ActiveFilter[]
}

// Aktualizované pohledy podle požadavků v instructions.md
export const views: JobViewConfig[] = [
  { 
    value: "Aktivní", 
    label: "Aktivní",
    filters: {
      status: "Aktivní"
    } 
  },
  { 
    value: "Zveřejněný", 
    label: "Zveřejněné",
    filters: {
      status: "Aktivní",
      "advertisement.status": "Vystavený"
    } 
  },
  { 
    value: "Nezveřejněný", 
    label: "Nezveřejněné",
    filters: {
      status: "Aktivní",
      "advertisement.status": ["Ukončený", "Nevystavený"]
    } 
  },
  { 
    value: "Rozpracovaný", 
    label: "Rozpracované",
    filters: {
      status: "Rozpracovaný"
    } 
  },
  { 
    value: "Archivní", 
    label: "Archivní",
    filters: {
      status: "Archivní"
    } 
  },
]

const eshopViews: JobViewConfig[] = [
  { value: "addons", label: "Addony a premium služby" },
  { value: "credits", label: "Kredity a inzerování" },
  { value: "invoices", label: "Vystavené faktury" },
]

export function JobViews({ onViewChange, activeView = "Aktivní", counts, isEshop = false, activeFilters = [] }: JobViewsProps) {
  const currentViews = isEshop ? eshopViews : views
  const defaultValue = isEshop ? "addons" : "Aktivní"
  const [createViewOpen, setCreateViewOpen] = useState(false)
  
  // Funkce pro získání popisu záložky podle hodnoty
  const getTabDescription = (value: string): string => {
    switch(value) {
      case "Zveřejněný":
        return "Aktivní nábory s vystavenou inzercí";
      case "Nezveřejněný":
        return "Aktivní nábory s ukončenou inzercí";
      case "Aktivní":
        return "Aktivní nábory kde je jak vytavená, tak ukončená inzerce";
      case "Rozpracovaný":
        return "Nábory ve stavu rozpracovaný";
      case "Archivní":
        return "Nábory ve stavu archivní";
      default:
        return "";
    }
  };

  const handleSaveView = (viewName: string) => {
    console.log("Ukládám pohled:", viewName, "s filtry:", activeFilters);
    // Zde byste typicky uložili pohled do backendu nebo local storage
  }

  return (
    <>
      <div className="flex justify-start items-center">
        <Tabs defaultValue={defaultValue} value={activeView} onValueChange={(value) => onViewChange?.(value)} className="">
          <TabsList className="w-full justify-start border-b-0 p-0 left-0 bg-background pl-5">
            {currentViews.map((view) => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
              >
                <div className="flex items-center gap-2">
                  {view.label}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 relative group cursor-help">
                        <span className="group-hover:opacity-0 transition-opacity absolute inset-0 flex items-center justify-center">
                          {counts && counts[view.value as keyof typeof counts] !== undefined
                            ? counts[view.value as keyof typeof counts]
                            : 0}
                        </span>
                        <Info className="opacity-0 group-hover:opacity-100 transition-opacity" size={15} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="z-[100]">
                      <p>{getTabDescription(view.value)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <CreateViewDialog
        open={createViewOpen}
        onOpenChange={setCreateViewOpen}
        activeFilters={activeFilters}
        onSave={handleSaveView}
      />
    </>
  )
}

