"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type JobStatus = "active" | "inactive" | "internal" | "archive" | "draft"

interface JobViewsProps {
  onViewChange?: (value: JobStatus | "open" | string) => void
  activeView?: JobStatus | "open" | string
  counts: Record<JobStatus | "open" | string, number>
  isEshop?: boolean
}

// Update the views array to include the new "draft" status for "Rozpracovaný"
const views = [
  { value: "open", label: "Aktivní" },
  { value: "active", label: "Zveřejněný" },
  { value: "inactive", label: "Nezveřejněný" },
  { value: "internal", label: "Interní" },
  { value: "draft", label: "Rozpracovaný" },
  { value: "archive", label: "Archivní" },
]

const eshopViews = [
  { value: "addons", label: "Addony a premium služby" },
  { value: "credits", label: "Kredity a inzerování" },
  { value: "invoices", label: "Vystavené faktury" },
]

export function JobViews({ onViewChange, activeView = "open", counts, isEshop = false }: JobViewsProps) {
  const currentViews = isEshop ? eshopViews : views
  const defaultValue = isEshop ? "addons" : "open"

  // Update the TabsList to ensure it properly displays the new status
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

