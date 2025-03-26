"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobStatus } from "@/types/job-posting"

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

export function JobViews({ onViewChange, activeView = "Aktivní", counts, isEshop = false }: JobViewsProps) {
  const currentViews = isEshop ? eshopViews : views
  const defaultValue = isEshop ? "addons" : "Aktivní"

  return (
    <Tabs defaultValue={defaultValue} value={activeView} onValueChange={(value) => onViewChange?.(value)}>
      <TabsList className="w-full justify-start border-b-0 p-0 left-0 bg-background px-5">
        {currentViews.map((view) => (
          <TabsTrigger
            key={view.value}
            value={view.value}
            className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
          >
            <div className="flex items-center gap-2">
              {view.label}
              <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {counts && counts[view.value as keyof typeof counts] !== undefined
                  ? counts[view.value as keyof typeof counts]
                  : 0}
              </span>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

