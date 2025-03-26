"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { JobFilters, type ActiveFilter } from "@/components/job-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { PostingActions } from "@/components/posting-actions"
import { PageHeader } from "@/components/page-header"
import { Checkbox } from "@/components/ui/checkbox"
import { JobPostingTable } from "@/components/job-posting-table"
import { PositionNote } from "@/components/position-note"
import { RepublishAdvertsimentModal } from "@/components/republish-advertisment-modal"
import Link from "next/link"

import { JobMenuAction } from "@/components/job-menu-action"
import type { SortOption } from "@/components/sort-menu"

import type { JobPosting, JobPortal, JobStatus } from "@/types/job-posting"
import { getStatusColor, statusMapping } from "@/types/job-posting"
import { Eye } from "lucide-react"

// Sample notes
const sampleNotes = [
  "Kandidát má dobré zkušenosti s React a TypeScript. Hledáme někoho, kdo může nastoupit co nejdříve.",
  "Potřebujeme najít někoho s lepšími znalostmi Javy. Tento kandidát by mohl být vhodný pro seniorní pozici.",
  "Pozice vyžaduje cestování, což může být problém pro některé kandidáty. Kandidát požaduje vyšší plat, než můžeme nabídnout.",
]

// Ikony pro portály
const iconMapping = {
  JobsIcon,
  PraceIcon,
  CarreerIcon,
  IntranetIcon,
  LinkedInIcon: PraceIcon, // Fallback
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
  }).format(new Date(dateString))
}

const formatDateWithYear = (dateString: string) => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(dateString))
}

const isExpiringSoon = (expiresAt: string): boolean => {
  const expiryDate = new Date(expiresAt)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 && diffDays <= 7
}

const getDaysUntilExpiry = (expiresAt: string): number => {
  const expiryDate = new Date(expiresAt)
  const today = new Date()
  const diffTime = expiryDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Random data pro demonstraci
const getRandomNewCandidates = (jobId: string): number | null => {
  if (Number.parseInt(jobId.substring(2, 5), 16) % 3 === 0) {
    return Math.floor(Math.random() * 20) + 1
  }
  return null
}

interface JobPostingListProps {
  jobPostings: JobPosting[]
}

export function JobPostingList({ jobPostings }: JobPostingListProps) {
  // Log v komponentě JobPostingList
  console.log("=== Data v komponentě JobPostingList ===");
  console.log(`Počet pracovních pozic přijatých v komponentě: ${jobPostings?.length || 0}`);
  
  if (jobPostings && jobPostings.length > 0) {
    console.log("První pozice:", jobPostings[0]);
    
    // Výpis stavů
    const statuses = [...new Set(jobPostings.map(job => job.status))];
    console.log("Unikátní stavy:", statuses);
    
    // Výpis lokací
    const locations = [...new Set(jobPostings.map(job => job.location))];
    console.log("Unikátní lokace:", locations);
    
    // Výpis recruiterů
    const recruiters = [...new Set(jobPostings.map(job => job.recruiter.name))];
    console.log("Unikátní recruiteři:", recruiters);
  }
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [activeView, setActiveView] = useState<JobStatus | "open">("open") // Default to "open" view
  const [currentSort, setCurrentSort] = useState<SortOption>("created-desc")
  const [bulkActionEnabled, setBulkActionEnabled] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [viewType, setViewType] = useState<"cards" | "table">("cards")
  const [recruiterFilter, setRecruiterFilter] = useState("")
  const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false)
  const [selectedJobForRepublish, setSelectedJobForRepublish] = useState<JobPosting | null>(null)

  // Nový handler pro změnu pohledu, který nastaví odpovídající filtry
  const handleViewChange = (view: string) => {
    console.log(`=== Změna pohledu na: "${view}" ===`);
    
    // Nejprve nastavíme aktivní pohled pro UI
    setActiveView(view as JobStatus | "open");
    
    // Pro každý pohled definujeme odpovídající filtry
    let newFilters: ActiveFilter[] = [...activeFilters];
    
    // Odstraníme existující filtry statusu, abychom je mohli nahradit
    newFilters = newFilters.filter(f => f.id !== "status");
    
    // Pro každý pohled nastavíme odpovídající filtry
    if (view !== "open") {
      // Přidáme filtr podle vybraného pohledu
      newFilters.push({
        id: "status",
        label: "Stav náboru",
        value: view
      });
      
      console.log(`Nastavuji filtr status: ${view}`);
    } else {
      console.log("Odstraňuji filtry stavu - zobrazuji všechny pozice");
    }
    
    // Aktualizujeme filtry
    handleFilterChange(newFilters);
  };

  // Handler pro změnu filtrů s logováním
  const handleFilterChange = (filters: ActiveFilter[]) => {
    console.log("=== Aplikované filtry ===");
    if (filters.length === 0) {
      console.log("Žádné aktivní filtry");
      
      // Když nejsou žádné filtry, nastavíme pohled na "open"
      if (activeView !== "open") {
        setActiveView("open");
        console.log("Změna pohledu na: 'open' (žádné filtry)");
      }
    } else {
      filters.forEach((filter, index) => {
        console.log(`Filtr #${index + 1}: ${filter.id} = ${filter.value}`);
      });
      
      // Kontrola, zda je mezi filtry status, a pokud ano, aktualizujeme pohled
      const statusFilter = filters.find(f => f.id === "status");
      if (statusFilter && statusFilter.value) {
        const matchingStatus = statusFilter.value as JobStatus;
        if (activeView !== matchingStatus) {
          setActiveView(matchingStatus);
          console.log(`Synchronizuji pohled s filtrem status: ${matchingStatus}`);
        }
      } else if (activeView !== "open") {
        // Pokud není nastaven žádný filtr statusu, nastavíme pohled na "open"
        setActiveView("open");
        console.log("Změna pohledu na: 'open' (žádný filtr statusu)");
      }
    }
    console.log("=== Souhrn filtrů ===");
    const filterGroups: Record<string, string[]> = {};
    filters.forEach(filter => {
      if (!filterGroups[filter.id]) {
        filterGroups[filter.id] = [];
      }
      if (filter.value) {
        filterGroups[filter.id].push(filter.value);
      }
    });
    console.log(filterGroups);
    console.log("========================");
    
    setActiveFilters(filters);
  };

  // Handler pro změnu textového vyhledávání s logováním
  const handleSearchChange = (query: string) => {
    console.log(`=== Vyhledávací dotaz: "${query}" ===`);
    setSearchQuery(query);
  };

  // Handler pro změnu filtru náboráře s logováním
  const handleRecruiterChange = (recruiter: string) => {
    console.log(`=== Filtrování podle náboráře: "${recruiter}" ===`);
    setRecruiterFilter(recruiter);
  };

  const filteredJobs = jobPostings.filter((job) => {
    // Nejdříve zalogujeme, jaké filtry budou aplikovány na tento job
    console.log(`Filtrování pozice ${job.id} (${job.title}):`);
    
    // Už nekontrolujeme activeView přímo, protože jsme jej převedli na filtry
    // Ale pro účely logování stále kontrolujeme a vypisujeme pohled
    console.log(`- Aktivní pohled: '${activeView}'`);
    
    // Pak aplikovat textové vyhledávání
    if (searchQuery) {
      const matchesQuery = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      console.log(`- Vyhledávací dotaz: '${searchQuery}' - ${matchesQuery ? 'odpovídá' : 'neodpovídá'}`);
      if (!matchesQuery) return false;
    }

    // Aplikovat filtr náboráře
    if (recruiterFilter) {
      const matchesRecruiter = job.recruiter.name === recruiterFilter;
      console.log(`- Filtr náboráře: '${recruiterFilter}' - ${matchesRecruiter ? 'odpovídá' : 'neodpovídá'}`);
      if (!matchesRecruiter) return false;
    }

    // Aplikovat všechny aktivní filtry
    const passesAllFilters = activeFilters.every((filter) => {
      if (!filter.value) {
        console.log(`- Filtr ${filter.id}: prázdná hodnota - pozice prochází`);
        return true; // Přeskočit prázdné filtry
      }

      let passes = false;
      
      switch (filter.id) {
        case "status":
          passes = job.status === filter.value;
          console.log(`- Filtr 'status': '${filter.value}' - ${passes ? 'odpovídá' : 'neodpovídá'} statusu '${job.status}'`);
          break;
          
        case "recruiter":
          passes = job.recruiter.name === filter.value;
          console.log(`- Filtr 'recruiter': '${filter.value}' - ${passes ? 'odpovídá' : 'neodpovídá'} náboráři '${job.recruiter.name}'`);
          break;
          
        case "location":
          passes = job.location === filter.value;
          console.log(`- Filtr 'location': '${filter.value}' - ${passes ? 'odpovídá' : 'neodpovídá'} lokalitě '${job.location}'`);
          break;
          
        case "adStatus":
          if (filter.value === "Vystavený") {
            passes = job.advertisement.active;
            console.log(`- Filtr 'adStatus': 'Vystavený' - ${passes ? 'odpovídá' : 'neodpovídá'} (inzerát ${job.advertisement.active ? 'je' : 'není'} aktivní)`);
          } else if (filter.value === "Ukončený") {
            passes = !job.advertisement.active && job.advertisement.portals.length > 0;
            console.log(`- Filtr 'adStatus': 'Ukončený' - ${passes ? 'odpovídá' : 'neodpovídá'} (inzerát ${!job.advertisement.active && job.advertisement.portals.length > 0 ? 'je ukončený' : 'není ukončený'})`);
          } else if (filter.value === "Nevystavený") {
            passes = !job.advertisement.active && job.advertisement.portals.length === 0;
            console.log(`- Filtr 'adStatus': 'Nevystavený' - ${passes ? 'odpovídá' : 'neodpovídá'} (inzerát ${!job.advertisement.active && job.advertisement.portals.length === 0 ? 'není vystavený' : 'je vystavený'})`);
          }
          break;
          
        case "portal":
          passes = job.advertisement.portals.some((portal) => portal.name === filter.value);
          const portals = job.advertisement.portals.map(p => p.name).join(', ');
          console.log(`- Filtr 'portal': '${filter.value}' - ${passes ? 'odpovídá' : 'neodpovídá'} (dostupné portály: ${portals || 'žádné'})`);
          break;
          
        default:
          console.log(`- Neznámý filtr '${filter.id}' - pozice prochází`);
          passes = true;
      }
      
      return passes;
    });

    // Zalogujeme výsledek filtrování
    console.log(`Výsledek filtrování pro pozici ${job.id}: ${passesAllFilters ? 'ZOBRAZIT' : 'SKRÝT'}`);
    console.log('------------------------');
    
    return passesAllFilters;
  })

  // Sort the filtered jobs based on the current sort option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (currentSort) {
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "created-asc":
        const aPublishedAt = a.advertisement.portals[0]?.publishedAt || ""
        const bPublishedAt = b.advertisement.portals[0]?.publishedAt || ""
        return new Date(aPublishedAt).getTime() - new Date(bPublishedAt).getTime()
      case "created-desc":
        const aCreatedAt = a.advertisement.portals[0]?.publishedAt || ""
        const bCreatedAt = b.advertisement.portals[0]?.publishedAt || ""
        return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime()
      case "expires-asc":
        const aExpiresAt = a.advertisement.portals[0]?.expiresAt || ""
        const bExpiresAt = b.advertisement.portals[0]?.expiresAt || ""
        return new Date(aExpiresAt).getTime() - new Date(bExpiresAt).getTime()
      case "expires-desc":
        const aExpiryDate = a.advertisement.portals[0]?.expiresAt || ""
        const bExpiryDate = b.advertisement.portals[0]?.expiresAt || ""
        return new Date(bExpiryDate).getTime() - new Date(aExpiryDate).getTime()
      default:
        return 0
    }
  })

  const renderPortalIcon = (portal: JobPortal) => {
    const Icon = portal.icon && iconMapping[portal.icon as keyof typeof iconMapping] 
      ? iconMapping[portal.icon as keyof typeof iconMapping] 
      : JobsIcon
    return <Icon className="h-7 w-7 text-muted-foreground hover:text-foreground" />
  }

  const handleBulkActionToggle = (enabled: boolean) => {
    setBulkActionEnabled(enabled)
    if (!enabled) {
      setSelectedJobs([])
    }
  }

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const isAllSelected = sortedJobs.length > 0 && selectedJobs.length === sortedJobs.length

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedJobs([])
    } else {
      setSelectedJobs(sortedJobs.map((job) => job.id))
    }
  }

  // Calculate counts for each status category
  const statusCounts = {
    open: jobPostings.length,
    "Aktivní": jobPostings.filter((job) => job.status === "Aktivní").length,
    "Rozpracovaný": jobPostings.filter((job) => job.status === "Rozpracovaný").length,
    "Archivní": jobPostings.filter((job) => job.status === "Archivní").length,
  }

  // Rozdělení portálů na aktivní a neaktivní
  const getActivePortals = (job: JobPosting) => {
    return job.advertisement.active 
      ? job.advertisement.portals
      : []
  }
  
  const getExpiredPortals = (job: JobPosting) => {
    return !job.advertisement.active && job.advertisement.portals.length > 0
      ? job.advertisement.portals
      : []
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Nábory"
          activeView={activeView}
          onViewChange={handleViewChange}
          counts={statusCounts}
        />
        <div className="container mx-auto px-4">
          <JobFilters
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onRecruiterChange={handleRecruiterChange}
          />
          <PostingActions
            visibleCount={sortedJobs.length}
            selectedCount={selectedJobs.length}
            onSortChange={setCurrentSort}
            onBulkActionToggle={handleBulkActionToggle}
            onSelectAll={(checked) => {
              if (checked) {
                setSelectedJobs(sortedJobs.map((job) => job.id))
              } else {
                setSelectedJobs([])
              }
            }}
            viewType={viewType}
            onViewChange={(view) => setViewType(view)}
            activeView={activeView}
          />

          {viewType === "table" ? (
            <div className="px-6 py-2">
              <div className="bg-white rounded-md border shadow-sm overflow-auto">
                <JobPostingTable
                  jobs={sortedJobs}
                  bulkActionEnabled={bulkActionEnabled}
                  selectedJobs={selectedJobs}
                  onJobSelect={toggleJobSelection}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 mt-1">
              {sortedJobs.map((job, index) => (
                <Card key={job.id} className="w-full overflow-hidden">
                  <CardContent className="flex flex-col justify-between items-start p-4">
                    <div className="flex flex-row items-start gap-1 flex-1 justify-between w-full">
                      <div className="flex items-start gap-4 w-full justify-between">
                        <div className="flex items-center gap-12">
                          <div className="flex items-start gap-3">
                            {bulkActionEnabled ? (
                              <Checkbox
                                checked={selectedJobs.includes(job.id)}
                                onCheckedChange={() => {
                                  toggleJobSelection(job.id)
                                }}
                                className="mt-1"
                                aria-label={`Vybrat pozici ${job.title}`}
                              />
                            ) : (
                              <JobMenuAction job={job} />
                            )}
                            <div className="min-w-[320px] space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold leading-none tracking-tight">
                                  <Link
                                    href={`/job/${job.id}`}
                                    className="hover:text-primary hover:underline cursor-pointer"
                                  >
                                    {job.title}
                                  </Link>
                                </h3>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div
                                      className={`h-3 w-3 rounded-full ${getStatusColor(job.status)}`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {job.status}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-4">
                                  <Dialog>
                                    <Tooltip delayDuration={300}>
                                      <TooltipTrigger>
                                        <DialogTrigger asChild>
                                          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                                            <Avatar className="h-6 w-6">
                                              <AvatarFallback className="text-xs font-medium uppercase">
                                                <div className="aspect-square h-full w-full flex items-center justify-center">
                                                  {job.recruiter.name
                                                    .split(" ")
                                                    .map((part) => part[0])
                                                    .join("")}
                                                </div>
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-muted-foreground">{job.recruiter.name}</span>
                                            {job.assignedUsers.length > 1 && (
                                              <Badge variant="secondary" className="px-1">
                                                +{job.assignedUsers.length - 1}
                                              </Badge>
                                            )}
                                          </div>
                                        </DialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>Zobrazit náboráže a kolegy</TooltipContent>
                                    </Tooltip>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Náboráři a zapojený uživatelé</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        {job.assignedUsers.map((user) => (
                                          <div
                                            key={user.id}
                                            className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                                          >
                                            <Avatar className="h-10 w-10">
                                              <AvatarFallback className="text-sm font-medium uppercase">
                                                {user.name
                                                  .split(" ")
                                                  .map((part) => part[0])
                                                  .join("")}
                                              </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                              <span className="font-medium">{user.name}</span>
                                              <span className="text-sm text-muted-foreground">{user.role}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                                <p className="text-sm text-muted-foreground flex">{job.location}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2"></div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div
                            className={`flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer`}
                          >
                            {getRandomNewCandidates(job.id) && (
                              <div className="absolute -right-1 rounded-full bg-[#E61F60] text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                                +{getRandomNewCandidates(job.id)}
                              </div>
                            )}
                            <span className="text-lg font-semibold"> {job.candidates.new}</span>
                            <span className="text-xs text-muted-foreground">Nový</span>
                          </div>
                          <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                            <span className="text-lg font-semibold "> {job.candidates.inProcess}</span>
                            <span className="text-xs ">Ve hře</span>
                          </div>
                          <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                            <span className="text-lg font-semibold"> {job.candidates.total}</span>
                            <span className="text-xs text-muted-foreground">Celkem</span>
                          </div>
                        </div>
                        <div className="w-60 shrink-0">
                          <PositionNote
                            recruiterName={job.recruiter.name}
                            createdAt={index < 3 ? new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000) : undefined}
                            text={index < 3 ? sampleNotes[index] : undefined}
                            hasNote={index < 3}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 flex items-center gap-6 px-[48px]">
                      {getActivePortals(job).length > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(getActivePortals(job)[0].publishedAt)} - {formatDate(getActivePortals(job)[0].expiresAt)}
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-1">
                              {getActivePortals(job).map((portal) => (
                                <a
                                  key={portal.url}
                                  href={portal.url}
                                  className="relative flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0"
                                  title={portal.name}
                                >
                                  {renderPortalIcon(portal)}
                                </a>
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center gap-1.5">
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {job.performance.views}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>Celkem shlédnutí</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      )}

                      {getActivePortals(job).filter((portal) => isExpiringSoon(portal.expiresAt)).length > 0 && (
                        <div className="flex items-center gap-3">
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="flex items-center gap-2 rounded-full bg-amber-100 px-2 py-0.5">
                                <span className="text-xs font-medium text-amber-800">
                                  {`Zkončí za ${getDaysUntilExpiry(getActivePortals(job).find((portal) => isExpiringSoon(portal.expiresAt))?.expiresAt || "")} ${getDaysUntilExpiry(getActivePortals(job).find((portal) => isExpiringSoon(portal.expiresAt))?.expiresAt || "") === 1 ? "den" : "dny"}`}
                                </span>
                                <div className="flex -space-x-1">
                                  {getActivePortals(job)
                                    .filter((portal) => isExpiringSoon(portal.expiresAt))
                                    .map((portal) => (
                                      <div
                                        key={portal.url}
                                        className="relative flex h-7 w-7 items-center justify-center rounded-full border border-amber-300 bg-white"
                                        title={portal.name}
                                      >
                                        {renderPortalIcon(portal)}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-[240px] p-0 z-[9999]">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="p-2 text-left text-xs font-medium">Portál</th>
                                    <th className="p-2 text-left text-xs font-medium">Končí</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getActivePortals(job)
                                    .filter((portal) => isExpiringSoon(portal.expiresAt))
                                    .map((portal) => (
                                      <tr key={portal.url} className="border-b last:border-0">
                                        <td className="p-2 text-xs">{portal.name}</td>
                                        <td className="p-2 text-xs">{formatDateWithYear(portal.expiresAt)}</td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              <div className="border-t p-2">
                                <Button className="w-full" size="sm">
                                  Prodloužit inzerci
                                </Button>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      )}
                      {getExpiredPortals(job).length > 0 && (
                        <div className="flex items-center gap-3">
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="flex items-center gap-2 rounded-full bg-[#FFECEC] px-2 py-0.5">
                                <span className="text-xs font-medium text-[#9B0000]">
                                  {(() => {
                                    const expiryDates = getExpiredPortals(job).map((p) => p.expiresAt)
                                    const allSameDate = expiryDates.every((date) => date === expiryDates[0])

                                    if (allSameDate && expiryDates.length > 0) {
                                      return `Ukončený od ${formatDate(expiryDates[0])}`
                                    }

                                    return `${getExpiredPortals(job).length} ukončený ${
                                      getExpiredPortals(job).length === 1 ? "inzerát" : "inzeráty"
                                    }`
                                  })()}
                                </span>
                                <div className="flex -space-x-1">
                                  {getExpiredPortals(job).slice(0, 3).map((portal) => (
                                    <div
                                      key={portal.url}
                                      className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white"
                                      title={portal.name}
                                    >
                                      {renderPortalIcon(portal)}
                                    </div>
                                  ))}
                                  {getExpiredPortals(job).length > 3 && (
                                    <div
                                      className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white text-xs font-medium"
                                      title="More portals"
                                    >
                                      +{getExpiredPortals(job).length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-[280px] p-0">
                              <div className="p-2 border-b">
                                <h4 className="font-medium text-sm">
                                  Ukončené portály ({getExpiredPortals(job).length})
                                </h4>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto">
                                <table className="w-full">
                                  <thead className="sticky top-0 bg-white">
                                    <tr className="border-b">
                                      <th className="p-2 text-left text-xs font-medium">Portál</th>
                                      <th className="p-2 text-left text-xs font-medium">Ukončeno</th>
                                      <th className="p-2 text-left text-xs font-medium">Zobrazení</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getExpiredPortals(job).map((portal) => (
                                      <tr key={portal.url} className="border-b last:border-0">
                                        <td className="p-2 text-xs">
                                          <div className="flex items-center gap-2">
                                            <div className="h-5 w-5">{renderPortalIcon(portal)}</div>
                                            {portal.name}
                                          </div>
                                        </td>
                                        <td className="p-2 text-xs">{formatDate(portal.expiresAt)}</td>
                                        <td className="p-2 text-xs">{portal.performance?.views || 0}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="border-t p-2">
                                <Button
                                  className="w-full"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedJobForRepublish(job)
                                    setIsRepublishModalOpen(true)
                                  }}
                                >
                                  Znovu vystavit inzerát
                                </Button>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      )}
                      {job.advertisement.portals.length === 0 && (
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-100 px-3 py-1">
                            <span className="text-sm text-gray-500">Zatím nevystavený žádný inzerát</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedJobForRepublish && (
        <RepublishAdvertsimentModal
          portals={getExpiredPortals(selectedJobForRepublish)}
          open={isRepublishModalOpen}
          onOpenChange={setIsRepublishModalOpen}
          onConfirm={(selectedPortals) => {
            console.log("Republishing portals:", selectedPortals)
            setIsRepublishModalOpen(false)
          }}
        />
      )}
    </TooltipProvider>
  )
}

