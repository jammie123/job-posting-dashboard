"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobStatus } from "@/types/job-posting"

interface JobViewsProps {
  onViewChange?: (value: JobStatus | "open" | string) => void
  activeView?: JobStatus | "open" | string
  counts: Record<JobStatus | "open" | string, number>
  isEshop?: boolean
}

// Aktualizované pohledy s českými názvy stavů
const views = [
  { value: "open", label: "Všechny" },
  { value: "Aktivní", label: "Aktivní" },
  { value: "Rozpracovaný", label: "Rozpracovaný" },
  { value: "Archivní", label: "Archivní" },
]

const eshopViews = [
  { value: "addons", label: "Addony a premium služby" },
  { value: "credits", label: "Kredity a inzerování" },
  { value: "invoices", label: "Vystavené faktury" },
]

export function JobViews({ onViewChange, activeView = "open", counts, isEshop = false }: JobViewsProps) {
  const currentViews = isEshop ? eshopViews : views
  const defaultValue = isEshop ? "addons" : "open"

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

