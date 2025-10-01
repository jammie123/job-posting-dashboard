"use client"

/*
 * DŮLEŽITÉ: Import a mapování ikon pro portály
 * ============================================
 * Pro správné zobrazení ikon portálů je potřeba:
 * 1. Importovat všechny požadované ikony z components/icons
 * 2. Přidat je do objektu iconMapping níže
 * 3. Zajistit, že každý záznam portálu v mock-jobs.json má hodnotu "icon" odpovídající klíči v iconMapping
 *
 * Pokud ikona v mapování chybí, použije se výchozí JobsIcon jako fallback
 */

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  JobsIcon,
  PraceIcon,
  PraceZaRohemIcon,
  JobspraceIcon,
  CarreerIcon,
  IntranetIcon,
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
} from "@/components/icons"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { JobFilters, type ActiveFilter } from "@/components/job-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PostingActions } from "@/components/posting-actions"
import { PageHeader } from "@/components/page-header"
import { Checkbox } from "@/components/ui/checkbox"
import { JobPostingTable } from "./job-posting-table"
import { PositionNote } from "@/components/position-note"
import { RepublishAdvertsimentModal } from "@/components/republish-advertisment-modal"
import Link from "next/link"

import { JobMenuAction } from "@/components/job-menu-action"
import type { SortOption } from "@/components/sort-menu"

import type { JobPosting, JobPortal, JobStatus } from "@/types/job-posting"
import { getStatusColor, statusMapping } from "@/types/job-posting"
import { Eye, CalendarIcon, Search, ChartBar, MonitorSmartphoneIcon } from "lucide-react"
import { JobViews, JobViewConfig, views } from "@/components/job-views"

// Notes now come from job data (job.note)


// Ikony pro portály
const iconMapping = {
  JobsIcon,
  PraceIcon,
  JobspraceIcon,
  PraceZaRohemIcon,
  CarreerIcon,
  IntranetIcon,
  LinkedInIcon: PraceIcon, // Fallback
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
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

// Date helpers for per-portal status evaluation
const toMidnight = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const parseDateToMidnight = (dateString: string): Date => {
  const d = new Date(dateString)
  return toMidnight(d)
}

const isSameDay = (a: Date, b: Date): boolean => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const getEffectiveEndDate = (portal: JobPortal): Date => {
  const expires = parseDateToMidnight(portal.expiresAt)
  const cancel = portal.cancelAt ? parseDateToMidnight(portal.cancelAt) : null
  if (cancel) {
    return cancel.getTime() < expires.getTime() ? cancel : expires
  }
  return expires
}

const isPortalActive = (portal: JobPortal): boolean => {
  const today = toMidnight(new Date())
  const start = parseDateToMidnight(portal.publishedAt)
  const end = getEffectiveEndDate(portal)
  return start.getTime() <= today.getTime() && today.getTime() <= end.getTime()
}

const isPortalExpired = (portal: JobPortal): boolean => {
  const today = toMidnight(new Date())
  const end = getEffectiveEndDate(portal)
  return end.getTime() < today.getTime()
}

const isPortalExpiredYesterday = (portal: JobPortal): boolean => {
  const yesterday = toMidnight(new Date())
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(getEffectiveEndDate(portal), yesterday)
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
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    {
      id: "recruiter",
      label: "Náborář",
      value: "Anna Kovářová"
    },
    {
      id: "status",
      label: "Stav náboru",
      value: "Aktivní"
    }
  ])
  const [activeView, setActiveView] = useState("Aktivní")
  const [currentSort, setCurrentSort] = useState<SortOption>("created-desc")
  const [bulkActionEnabled, setBulkActionEnabled] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [viewType, setViewType] = useState<"cards" | "table">("cards")
  const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false)
  const [selectedJobForRepublish, setSelectedJobForRepublish] = useState<JobPosting | null>(null)

  // Helper function to get current recruiter filter value from activeFilters
  const getRecruiterFilter = (): string => {
    const recruiterFilter = activeFilters.find(f => f.id === "recruiter");
    return recruiterFilter?.value as string || "";
  };

  // Nový handler pro změnu pohledu, který nastaví odpovídající filtry
  const handleViewChange = (view: string) => {
    console.log(`=== Změna pohledu na: "${view}" ===`);

    // Nejprve nastavíme aktivní pohled pro UI
    setActiveView(view);

    // Načtení vlastních pohledů
    let customViews: JobViewConfig[] = [];
    try {
      const savedViews = localStorage.getItem('jobDashboard_customViews');
      if (savedViews) {
        customViews = JSON.parse(savedViews);
      }
    } catch (error) {
      console.error('Chyba při načítání vlastních pohledů:', error);
    }

    // Získáme konfiguraci pohledu - nejprve hledáme mezi výchozími pohledy, poté mezi vlastními
    const viewConfig = views.find((v: JobViewConfig) => v.value === view) ||
      customViews.find((v: JobViewConfig) => v.value === view);

    if (!viewConfig) {
      console.warn(`Pohled "${view}" nebyl nalezen v konfiguraci!`);
      return;
    }

    console.log(`Konfigurace pohledu:`, viewConfig.filters);

    // Při přepnutí na jakýkoliv pohled vyčistíme vyhledávání, ale zachováme filtr náboráře
    setSearchQuery("");

    // Vytvoříme nové pole filtrů podle konfigurace pohledu
    let newFilters: ActiveFilter[] = [];

    // Zachováme existující filtr náboráře, pokud existuje
    const existingRecruiterFilter = activeFilters.find(f => f.id === "recruiter");
    if (existingRecruiterFilter) {
      newFilters.push(existingRecruiterFilter);
    }

    // Pro každý pohled nastavíme odpovídající filtry
    if (viewConfig.filters) {
      // Procházíme všechny filtry definované v konfiguraci pohledu
      Object.entries(viewConfig.filters).forEach(([key, value]) => {
        if (key === "status" && value) {
          newFilters.push({
            id: "status",
            label: "Stav náboru",
            value: value as string
          });
          console.log(`Nastavuji filtr status: ${value}`);
        }
        else if (key === "advertisement.status" && value) {
          if (Array.isArray(value)) {
            newFilters.push({
              id: "adStatus",
              label: "Stav inzerátu",
              value: value,
              isMulti: true
            });
            console.log(`Nastavuji filtr stav inzerátu: [${value.join(", ")}]`);
          } else {
            newFilters.push({
              id: "adStatus",
              label: "Stav inzerátu",
              value: value as string
            });
            console.log(`Nastavuji filtr stav inzerátu: ${value}`);
          }
        }
        else if (key === "location" && value) {
          newFilters.push({
            id: "location",
            label: "Lokalita",
            value: value as string
          });
          console.log(`Nastavuji filtr lokalita: ${value}`);
        }
        else if (key === "department" && value) {
          newFilters.push({
            id: "department",
            label: "Oddělení",
            value: value as string
          });
          console.log(`Nastavuji filtr oddělení: ${value}`);
        }
        else if (key === "title" && value) {
          newFilters.push({
            id: "title",
            label: "Název pozice",
            value: value as string
          });
          console.log(`Nastavuji filtr názvu: ${value}`);
          // Také nastavíme vyhledávací dotaz pro title
          setSearchQuery(value as string);
        }
      });
    } else {
      console.log("Odstraňuji filtry stavu - zobrazuji všechny pozice");
    }

    // Aktualizujeme filtry
    setActiveFilters(newFilters);
  };

  // Handler pro změnu filtrů s logováním
  const handleFilterChange = (filters: ActiveFilter[]) => {
    console.log("=== Aplikované filtry ===");
    if (filters.length === 0) {
      console.log("Žádné aktivní filtry");

      // Když nejsou žádné filtry, nastavíme pohled na "Aktivní"
      if (activeView !== "Aktivní") {
        setActiveView("Aktivní");
        console.log("Změna pohledu na: 'Aktivní' (žádné filtry)");
      }
    } else {
      filters.forEach((filter, index) => {
        const valueStr = Array.isArray(filter.value)
          ? `[${filter.value.join(", ")}]`
          : filter.value;
        console.log(`Filtr #${index + 1}: ${filter.id} = ${valueStr}`);
      });

      // Kontrola, zda je mezi filtry status, a pokud ano, aktualizujeme pohled
      const statusFilter = filters.find(f => f.id === "status");
      if (statusFilter && statusFilter.value) {
        // Pro status filtr očekáváme vždy string, ne pole
        if (!Array.isArray(statusFilter.value)) {
          const matchingStatus = statusFilter.value;
          if (activeView !== matchingStatus) {
            setActiveView(matchingStatus);
            console.log(`Synchronizuji pohled s filtrem status: ${matchingStatus}`);
          }
        }
      } else if (activeView !== "Aktivní") {
        // Pokud není nastaven žádný filtr statusu, nastavíme pohled na "Aktivní"
        setActiveView("Aktivní");
        console.log("Změna pohledu na: 'Aktivní' (žádný filtr statusu)");
      }
    }
    console.log("=== Souhrn filtrů ===");
    const filterGroups: Record<string, string[]> = {};
    filters.forEach(filter => {
      if (!filterGroups[filter.id]) {
        filterGroups[filter.id] = [];
      }
      if (filter.value) {
        if (Array.isArray(filter.value)) {
          // Pokud je hodnota pole, přidáme všechny jeho hodnoty
          filter.value.forEach(val => {
            filterGroups[filter.id].push(val);
          });
        } else {
          // Jinak přidáme jednu hodnotu
          filterGroups[filter.id].push(filter.value);
        }
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

  // Handler pro změnu náboráře s logováním
  const handleRecruiterChange = (recruiter: string) => {
    console.log(`=== Filtrování podle náboráře: "${recruiter}" ===`);

    // Když se změní náborář, aktualizujeme aktivní filtry
    let newFilters = [...activeFilters];

    // Najdeme, jestli už existuje filtr recruiter
    const recruiterFilterIndex = newFilters.findIndex(f => f.id === "recruiter");

    if (recruiter) {
      // Pokud je vybrán náborář, přidáme nebo aktualizujeme filtr
      if (recruiterFilterIndex >= 0) {
        // Aktualizovat existující filtr
        newFilters[recruiterFilterIndex] = {
          ...newFilters[recruiterFilterIndex],
          value: recruiter
        };
      } else {
        // Přidat nový filtr
        newFilters.push({
          id: "recruiter",
          label: "Náborář",
          value: recruiter
        });
      }
    } else {
      // Pokud není vybrán náborář, odstraníme filtr, pokud existuje
      if (recruiterFilterIndex >= 0) {
        newFilters = newFilters.filter(f => f.id !== "recruiter");
      }
    }

    // Nastavíme aktualizované filtry
    setActiveFilters(newFilters);
  };

  // Helper funkce pro určení stavu inzerátu
  const getAdvertisementStatus = (job: JobPosting): string => {
    const portals = job.advertisement.portals || []
    const hasActivePortal = portals.some((p) => isPortalActive(p))
    if (hasActivePortal) return "Vystavený"
    if (portals.length > 0) return "Ukončený"
    return "Nevystavený"
  }

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

    // Odebírám separátní kontrolu recruiterFilter, protože nyní je součástí activeFilters

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
          const adStatus = getAdvertisementStatus(job);
          if (Array.isArray(filter.value)) {
            // Pokud je hodnota filtru pole, kontrolujeme, zda adStatus je v tomto poli
            passes = filter.value.includes(adStatus);
            console.log(`- Filtr 'adStatus': [${filter.value.join(", ")}] - ${passes ? 'odpovídá' : 'neodpovídá'} stavu inzerátu '${adStatus}'`);
          } else {
            // Jinak kontrolujeme přesnou shodu
            passes = adStatus === filter.value;
            console.log(`- Filtr 'adStatus': '${filter.value}' - ${passes ? 'odpovídá' : 'neodpovídá'} stavu inzerátu '${adStatus}'`);
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

  const renderPortalIcon = (portal: JobPortal, sizeClass: string = "h-8 w-8") => {
    console.log(`Rendering portal icon for ${portal.name}`, portal);

    if (!portal.icon) {
      console.warn(`Portál ${portal.name} nemá definovanou ikonu. Použije se výchozí JobsIcon.`);
      return <JobsIcon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />;
    }

    const iconExists = Object.keys(iconMapping).includes(portal.icon);
    if (!iconExists) {
      console.warn(`Ikona "${portal.icon}" pro portál ${portal.name} není v mapování. Použije se výchozí JobsIcon.`);
      return <JobsIcon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />;
    }

    const Icon = iconMapping[portal.icon as keyof typeof iconMapping];

    // Kontrola existence atributu highlighted
    if (portal.highlighted) {
      console.log(`Portal ${portal.name} is highlighted:`, portal.highlighted);
      // Pokud má portál atribut highlighted, aplikujeme větší velikost a zlatý okraj
      return <Icon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />;
    }

    // Standardní ikona bez zvýraznění
    return <Icon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />;
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

  // Calculate counts for each view category
  const statusCounts = {
    "Aktivní": jobPostings.filter((job) => job.status === "Aktivní").length,
    "Zveřejněný": jobPostings.filter((job) => job.status === "Aktivní" && getAdvertisementStatus(job) === "Vystavený").length,
    "Nezveřejněný": jobPostings.filter((job) => job.status === "Aktivní" &&
      (getAdvertisementStatus(job) === "Ukončený" || getAdvertisementStatus(job) === "Nevystavený")).length,
    "Rozpracovaný": jobPostings.filter((job) => job.status === "Rozpracovaný").length,
    "Archivní": jobPostings.filter((job) => job.status === "Archivní").length,
  }

  // Rozdělení portálů na aktivní a ukončené na základě dat
  const getActivePortals = (job: JobPosting) => {
    return (job.advertisement.portals || []).filter((p) => isPortalActive(p))
  }

  const getExpiredPortals = (job: JobPosting) => {
    return (job.advertisement.portals || []).filter((p) => isPortalExpired(p))
  }

  const getExpiredYesterdayPortals = (job: JobPosting) => {
    return (job.advertisement.portals || []).filter((p) => isPortalExpiredYesterday(p))
  }

  // Funkce pro ořezání dlouhého textu
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  }

  // Tato funkce získá celá data o vybraných inzerátech
  const getSelectedJobsData = () => {
    return sortedJobs.filter(job => selectedJobs.includes(job.id));
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Nábory"
          activeView={activeView}
          onViewChange={handleViewChange}
          counts={statusCounts}
          activeFilters={activeFilters}
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
            selectedJobs={getSelectedJobsData()}
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
                <Card key={job.id} className="w-full overflow-hidden group">
                  <CardContent className="flex flex-col justify-between items-start p-4 w-full">
                    <div className="flex flex-row items-start gap-1 flex-1 justify-between w-full">
                      <div className="flex items-start gap-4 justify-between w-full">
                        <div className="flex items-center gap-12 ">
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
                            <div className="min-w-[400px] space-y-1">
                              <div className="flex items-baseline gap-2 ">
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div
                                      className={`ml-1 h-3 w-3 rounded-full ${getStatusColor(job.status, job.advertisement)}`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {job.status === "Aktivní"
                                      ? `${job.status} - ${job.advertisement.active ? "Vystavený" : "Nevystavený"}`
                                      : job.status
                                    }
                                  </TooltipContent>
                                </Tooltip>
                                <h3 className="font-semibold flex gap-2 items-baseline leading-none tracking-tight">
                                  <Link
                                    href={`/job/${job.id}`}
                                    className="text-link-primary hover:text-link-primary hover:underline cursor-pointer"
                                  >
                                    {job.title}
                                  </Link>
                                  {job.department && (
                                    <div className="text-primary text-sm mt-1 flex items-center gap-1">
                                      ({job.department})

                                    </div>
                                  )}
                                </h3>

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
                                      <TooltipContent>Zobrazit náboráře a kolegy</TooltipContent>
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
                        

                        {job.status === "Rozpracovaný" ? (
                          <div className="flex items-center">
                            <div className="flex items-center px-4 py-2 rounded-md bg-gray-50">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                Poslední aktualizace: 1.4.2024
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex flex-col w-[100px] items-center gap-1 hover:bg-gray-100  relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer`}
                            >
                              {getRandomNewCandidates(job.id) && (
                                <div className="absolute -right-1 rounded-full bg-[#E61F60] text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                                  +{getRandomNewCandidates(job.id)}
                                </div>
                              )}
                              <span className="text-2xl font-semibold"> {job.candidates.new}</span>
                              <span className="text-xs text-muted-foreground">Nový</span>
                            </div>
                            <div className="flex flex-col  w-[100px] border-l items-center gap-1 hover:bg-gray-100  relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-2xl font-semibold "> {job.candidates.inProcess}</span>
                              <span className="text-xs ">Ve hře</span>
                            </div>
                            <div className="flex flex-col w-[100px] border-l border-gray-200 items-center gap-1 hover:bg-gray-100  relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-2xl font-semibold"> {job.candidates.total}</span>
                              <span className="text-xs text-muted-foreground">Celkem</span>
                            </div>
                          </div>
                        )}

                        <div className="min-w-[300px] w-[400px] flex justify-end items-center shrink-0">
                          {job.status !== "Rozpracovaný" && (
                                                <div className="flex flex-col gap-2 ml-10 w-[400px] ">
                                                {getActivePortals(job).length > 0 && (
                                                  <div className="flex items-center justify-end gap-3">
                                                    <Badge
                                                      variant="secondary"
                                                      className="text-sm font-medium text-green-800 dark:bg-green-900/50 dark:text-green-100  justify-center"
                                                    >
                                                      Běží do {formatDate(getActivePortals(job)[0].expiresAt)}
                                                    </Badge>
                                                    <div className="flex -space-x-3 items-cente w-[200px]">
                                                        {getActivePortals(job).map((portal) => (
                                                        <Tooltip key={portal.url}>
                                                          <TooltipTrigger asChild>
                                                            <a
                                                              href={portal.url}
                                                              className={`relative flex items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0 ${portal.highlighted ? 'h-10 w-10 border border-2 shadow-sm shadow-[#A866FF]/30 border-[#A866FF]' : 'h-10 w-10'}`}
                                                            >
                                                                {renderPortalIcon(portal, 'h-10 w-10')}
                                                            </a>
                                                          </TooltipTrigger>
                                                          <TooltipContent>
                                                            <div className="flex flex-col gap-1">
                                                              <span className="font-medium">{portal.name}</span>
                                                              <span className="text-xs text-muted">
                                                                {formatDateWithYear(portal.publishedAt)} - {formatDateWithYear(portal.expiresAt)}
                                                              </span>
                                                              {portal.highlighted && (
                                                                <span className="text-[10px] font-medium text-[#A866FF]" title={portal.highlighted.name}>
                                                                  Zvýraznění: {truncateText(portal.highlighted.name, 15)}
                                                                </span>
                                                              )}
                                                            </div>
                                                          </TooltipContent>
                                                        </Tooltip>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                  
                                                {getActivePortals(job).filter((portal) => isExpiringSoon(portal.expiresAt)).length > 0 && (
                                                  <div className="flex items-center gap-3  w-[400px] justify-end">
                                                    <HoverCard>
                                                      <HoverCardTrigger>
                                                        <div className="flex items-center gap-2  ">
                                                          <Badge
                                                            variant="secondary"
                                                            className="text-sm font-medium  text-amber-800 dark:bg-amber-900/50 dark:text-amber-100  justify-center"
                                                          >
                                                            Končí brzy
                                                          </Badge>
                                                          <div className="flex -space-x-3 items-center w-[200px]">
                                                            {getActivePortals(job)
                                                              .filter((portal) => isExpiringSoon(portal.expiresAt))
                                                              .map((portal) => (
                                                                <div
                                                                  key={portal.url}
                                                                  className={`relative flex items-center justify-center rounded-full border ${portal.highlighted ? ' bg-white h-10 w-10' : 'bg-white h-9 w-9'}`}
                                                                  title={portal.name}
                                                                >
                                                                  {renderPortalIcon(portal, portal.highlighted ? 'h-10 w-10' : 'h-9 w-9')}
                                                                </div>
                                                              ))}
                                                          </div>
                                                        </div>
                                                      </HoverCardTrigger>
                                                      <HoverCardContent className="w-[400px] p-0 z-[9999]">
                                                        <table className="w-full">
                                                          <thead>
                                                            <tr className="border-b">
                                                              <th className="p-2 text-left text-xs font-medium">Portál</th>
                                                              <th className="p-2 text-left text-xs font-medium">Končí</th>
                                                              <th className="p-2 text-left text-xs font-medium">Za</th>
                                                            </tr>
                                                          </thead>
                                                          <tbody>
                                                            {getActivePortals(job)
                                                              .filter((portal) => isExpiringSoon(portal.expiresAt))
                                                              .map((portal) => (
                                                                <tr key={portal.url} className="border-b last:border-0">
                                                                  <td className="p-2 text-xs">
                                                                    <div className="flex items-center gap-2">
                                                                      <div className={`rounded-full overflow-hidden ${portal.highlighted ? 'h-6 w-6' : 'h-5 w-5'}`}>{renderPortalIcon(portal)}</div>
                                                                      <div className="flex flex-col">
                                                                        <span title={portal.name}>{truncateText(portal.name)}</span>
                                                                        {portal.highlighted && (
                                                                          <span className="text-[10px] font-medium text-[#A866FF]" title={portal.highlighted.name}>
                                                                            {truncateText(portal.highlighted.name, 15)}
                                                                          </span>
                                                                        )}
                                                                      </div>
                                                                    </div>
                                                                  </td>
                                                                  <td className="p-2 text-xs">{formatDateWithYear(portal.expiresAt)}</td>
                                                                  <td className="p-2 text-xs font-medium text-amber-600">{getDaysUntilExpiry(portal.expiresAt)} {getDaysUntilExpiry(portal.expiresAt) === 1 ? "den" : "dny"}</td>
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
                  
                                                {(() => {
                                                  // First, show those that expired exactly yesterday
                                                  const yesterdayExpired = getExpiredYesterdayPortals(job)
                                                  if (yesterdayExpired.length > 0) {
                                                    const expiredDate = getEffectiveEndDate(yesterdayExpired[0])
                                                    return (
                                                      <div className="flex items-center gap-3 justify-end">
                                                        <Badge
                                                          variant="secondary"
                                                          className="text-sm font-medium text-red-800 dark:bg-red-900/50 dark:text-red-100 justify-center"
                                                        >
                                                          {`Ukončeno ${formatDate(expiredDate.toISOString())}`}
                                                        </Badge>
                                                        <div className="flex -space-x-3 w-[200px]">
                                                          {yesterdayExpired.slice(0, 3).map((portal) => (
                                                            <div
                                                              key={portal.url}
                                                              className={portal.highlighted ? 'relative flex items-center justify-center rounded-full border border-[#9B0000]/10 bg-white h-10 w-10' : 'relative flex items-center justify-center rounded-full border border-[#9B0000]/10 bg-white h-10 w-10'}
                                                              title={portal.name}
                                                            >
                                                              {renderPortalIcon(portal, portal.highlighted ? 'h-10 w-10' : 'h-10 w-10')}
                                                            </div>
                                                          ))}
                                                          {yesterdayExpired.length > 3 && (
                                                            <div
                                                              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white text-xs font-medium"
                                                              title="More portals"
                                                            >
                                                              +{yesterdayExpired.length - 3}
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    )
                                                  }
                                                  return null
                                                })()}

                                                {(() => {
                                                  const allExpired = getExpiredPortals(job)
                                                  const yesterdayExpired = getExpiredYesterdayPortals(job)
                                                  const otherExpired = allExpired.filter((p) => !isPortalExpiredYesterday(p))
                                                  if (otherExpired.length === 0) return null
                                                  return (
                                                    <div className="flex items-center gap-3 justify-end">
                                                      <HoverCard>
                                                        <HoverCardTrigger>
                                                          <div className="flex items-center gap-2">
                                                            <Badge
                                                              variant="secondary"
                                                              className="text-sm font-medium text-red-800 dark:bg-red-900/50 dark:text-red-100 justify-center"
                                                            >
                                                              {(() => {
                                                                const expiryDates = otherExpired.map((p) => p.expiresAt)
                                                                const allSameDate = expiryDates.every((date) => date === expiryDates[0])
                                                                if (allSameDate && expiryDates.length > 0) {
                                                                  return `Ukončeno ${formatDate(expiryDates[0])}`
                                                                }
                                                                return `Ukončeno`
                                                              })()}
                                                            </Badge>
                                                            <div className="flex -space-x-3 w-[200px]">
                                                              {otherExpired.slice(0, 3).map((portal) => (
                                                                <div
                                                                  key={portal.url}
                                                                  className={portal.highlighted ? 'relative flex items-center justify-center rounded-full border border-[#9B0000]/10 bg-white h-10 w-10' : 'relative flex items-center justify-center rounded-full border border-[#9B0000]/10 bg-white h-10 w-10'}
                                                                  title={portal.name}
                                                                >
                                                                  {renderPortalIcon(portal, portal.highlighted ? 'h-10 w-10' : 'h-10 w-10')}
                                                                </div>
                                                              ))}
                                                              {otherExpired.length > 3 && (
                                                                <div
                                                                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white text-xs font-medium"
                                                                  title="More portals"
                                                                >
                                                                  +{otherExpired.length - 3}
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-[280px] p-0">
                                                          <div className="p-2 border-b">
                                                            <h4 className="font-medium text-sm">
                                                              Ukončené portály ({otherExpired.length})
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
                                                                {otherExpired.map((portal) => (
                                                                  <tr key={portal.url} className="border-b last:border-0">
                                                                    <td className="p-2 text-xs">
                                                                      <div className="flex items-center gap-2">
                                                                        <div className={`rounded-full overflow-hidden ${portal.highlighted ? 'h-6 w-6' : 'h-5 w-5'}`}>{renderPortalIcon(portal, portal.highlighted ? 'h-6 w-6' : 'h-5 w-5')}</div>
                                                                        <div className="flex flex-col">
                                                                          <span title={portal.name}>{truncateText(portal.name)}</span>
                                                                          {portal.highlighted && (
                                                                            <span className="text-[10px] font-medium text-[#A866FF]" title={portal.highlighted.name}>
                                                                              {truncateText(portal.highlighted.name, 15)}
                                                                            </span>
                                                                          )}
                                                                        </div>
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
                                                  )
                                                })()}

                                              </div>
                                              


                          )}
                        </div>

                      </div>
                      

                    </div>
                    
                    <div className="mt-4 w-full">
                      <PositionNote
                        recruiterName={job.recruiter.name}
                        text={job.note}
                        hasNote={Boolean(job.note)}
                      />
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
          jobId={selectedJobForRepublish.id}
          onConfirm={(selectedPortals, updatedPortals) => {
            console.log("Republishing portals:", selectedPortals)
            if (updatedPortals) {
              console.log("Updated portals data:", updatedPortals)
            }
            setIsRepublishModalOpen(false)
          }}
        />
      )}
    </>
  )
}

