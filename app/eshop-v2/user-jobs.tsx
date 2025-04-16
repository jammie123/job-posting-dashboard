"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, PresentationIcon, Megaphone, Package } from "lucide-react"

export type FilterType = "all" | "recruitment" | "promotion" | "job-portals" | "active-purchased";

interface JobCardProps {
  title: string
  perex: string
  icon: React.ReactNode
  filterType: FilterType
  onClick: (filterType: FilterType) => void
  isActive: boolean
}

const JobCard: React.FC<JobCardProps> = ({ title, perex, icon, filterType, onClick, isActive }) => {
  return (
    <div 
      className="cursor-pointer transition-transform hover:scale-[1.02]"
      onClick={() => onClick(filterType)}
    >
      <Card className={`h-full border shadow-sm transition-all ${isActive 
        ? 'border-blue-500 shadow-md bg-blue-50' 
        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-md ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>
              {icon}
            </div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600">
            {perex}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

interface UserJobsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function UserJobs({ activeFilter = "all", onFilterChange }: UserJobsProps) {
  const jobCards = [
    {
      title: "Nábor a zpracování uchazečů",
      perex: "Rozšiř si teamio o pokročilé funkce, které ti pomůžou se správou kandidátů",
      icon: <Users size={20} />,
      filterType: "recruitment" as FilterType
    },
    {
      title: "Firemní prezentace",
      perex: "Buď lukrativní zaměstnavatel pro potenciální kandidáty. Na vzhledu záleží.",
      icon: <PresentationIcon size={20} />,
      filterType: "promotion" as FilterType
    },
    {
      title: "Potřebuješ inzerovat",
      perex: "Nabízíme velkou nabídku všech možných výhodných balíčků a zvýhodnění",
      icon: <Megaphone size={20} />,
      filterType: "job-portals" as FilterType
    },
    {
      title: "Jaké služby a balíčky mám aktivní",
      perex: "Přehled Vašich zakoupených služeb a jejich vypršení na jednom místě.",
      icon: <Package size={20} />,
      filterType: "active-purchased" as FilterType
    }
  ]

  return (
    <div className="my-6 mx-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Marketplace</h2>
      <p className="text-md font-normal text-gray-900 mb-10">Najdete tu vše, co potřebujete pro úšpěšné a efektivní nábor od náborových addonů až po různé balíčky inzerátů za lepší ceny</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {jobCards.map((card, index) => (
          <JobCard
            key={index}
            title={card.title}
            perex={card.perex}
            icon={card.icon}
            filterType={card.filterType}
            onClick={onFilterChange}
            isActive={activeFilter === card.filterType}
          />
        ))}
      </div>
    </div>
  )
} 