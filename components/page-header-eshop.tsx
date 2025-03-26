"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopHeader } from "@/components/top-header"
import { useState } from "react"

interface PageHeaderEshopProps {
  title: string
  onTabChange?: (tab: string) => void
}

export function PageHeaderEshop({ title, onTabChange }: PageHeaderEshopProps) {
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { value: "all", label: "Všechny", count: 15 },
    { value: "plánujem", label: "Akce a novinky", count: 3 },
    { value: "recruitment", label: "Nábor", count: 4 },
    { value: "promotion", label: "Propagace", count: 2 },
    { value: "security", label: "Zabezpečení", count: 1 },
    { value: "job-portals", label: "Inzerce", count: 5 },
    { value: "active-purchased", label: "Aktivní", count: 8 },
  ]

  // Handle tab change and call the callback
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (onTabChange) {
      onTabChange(value)
    }
  }

  return (
    <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background drop-shadow-sm">
      <TopHeader userName="Jan Novák" companyName="Acme Corporation s.r.o." />
      <div className="flex items-center justify-between px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start border-b-0 p-0 left-0 bg-background px-5">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="min-w-[100px] drop-shadow-none data-[state=active]:border-b-2 data-[state=active]:font-medium h-full rounded-none data-[state=active]:border-[#E61F60]"
            >
              <div className="flex items-center gap-2">
                {tab.label}
                <span className="inline-flex items-center justify-center w-6 h-5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}

