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

// Add this array of sample notes near the top of the file, after the imports
const sampleNotes = [
  "Kandidát má dobré zkušenosti s React a TypeScript. Hledáme někoho, kdo může nastoupit co nejdříve.",
  "Potřebujeme najít někoho s lepšími znalostmi Javy. Tento kandidát by mohl být vhodný pro seniorní pozici.",
  "Pozice vyžaduje cestování, což může být problém pro některé kandidáty. Kandidát požaduje vyšší plat, než můžeme nabídnout.",
]

// Add IntranetIcon to the iconMapping
const iconMapping = {
  JobsIcon,
  PraceIcon,
  CarreerIcon,
  IntranetIcon,
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

// Add this function after the getDaysUntilExpiry function
const getRandomNewCandidates = (jobId: string): number | null => {
  // Use the job ID as a seed to ensure consistent results
  // Only show new candidates for some jobs (based on job ID)
  if (Number.parseInt(jobId.substring(0, 8), 16) % 3 === 0) {
    return Math.floor(Math.random() * 20) + 1 // Random number between 1-20
  }
  return null
}

interface JobPostingListProps {
  jobPostings: JobPosting[]
}

export function JobPostingList({ jobPostings }: JobPostingListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [activeView, setActiveView] = useState<JobStatus | "all">("active") // Default to "active" view
  const [currentSort, setCurrentSort] = useState<SortOption>("created-desc")
  const [bulkActionEnabled, setBulkActionEnabled] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<string[]>([])
  const [viewType, setViewType] = useState<"cards" | "table">("cards")
  const [recruiterFilter, setRecruiterFilter] = useState("")
  const [isRepublishModalOpen, setIsRepublishModalOpen] = useState(false)
  const [selectedJobForRepublish, setSelectedJobForRepublish] = useState<JobPosting | null>(null)

  const filteredJobs = jobPostings.filter((job) => {
    // First check the active view
    if (activeView === "open") {
      // Show jobs that are active, inactive, or internal
      return ["active", "inactive", "internal"].includes(job.status)
    } else if (activeView !== "all" && job.status !== activeView) {
      return false
    }

    // Then apply text search
    if (!job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Apply recruiter filter
    if (recruiterFilter && job.recruiter.name !== recruiterFilter) {
      return false
    }

    // Then apply all active filters
    return activeFilters.every((filter) => {
      if (!filter.value) return true // Skip empty filters

      switch (filter.id) {
        case "status":
          return job.status === statusMapping[filter.value]
        case "recruiter":
          return job.recruiter.name === filter.value
        case "involved":
          return job.recruiter.assignedUsers?.some((user) => user.name === filter.value)
        case "location":
          return job.location === filter.value
        case "portal":
          if (job.status === "internal" && filter.value === "Intranet") {
            return true
          }
          return (
            job.advertisement.activePortals.some((portal) => portal.name === filter.value) ||
            job.advertisement.expiredPortals.some((portal) => portal.name === filter.value)
          )
        case "adStatus":
          if (filter.value === "Aktivní") {
            return job.advertisement.activePortals.length > 0
          } else if (filter.value === "Ukončený") {
            return job.advertisement.activePortals.length === 0 && job.advertisement.expiredPortals.length > 0
          }
          return false
        case "createDate":
          // Simplified date filtering for demonstration
          const today = new Date()
          const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
          const createdDate =
            job.advertisement.activePortals[0]?.publishedAt || job.advertisement.expiredPortals[0]?.publishedAt

          if (!createdDate) return false

          const date = new Date(createdDate)
          switch (filter.value) {
            case "Dnes":
              return date.toDateString() === today.toDateString()
            case "Tento týden":
              return date >= thisWeek
            case "Tento měsíc":
              return date >= thisMonth
            default:
              return true
          }
        default:
          return true
      }
    })
  })

  // Sort the filtered jobs based on the current sort option
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (currentSort) {
      case "title-asc":
        return a.title.localeCompare(b.title)
      case "title-desc":
        return b.title.localeCompare(a.title)
      case "created-asc":
        const aCreatedDate =
          a.advertisement.activePortals[0]?.publishedAt || a.advertisement.expiredPortals[0]?.publishedAt || ""
        const bCreatedDate =
          b.advertisement.activePortals[0]?.publishedAt || b.advertisement.expiredPortals[0]?.publishedAt || ""
        return new Date(aCreatedDate).getTime() - new Date(bCreatedDate).getTime()
      case "created-desc":
        const aCreatedDate2 =
          a.advertisement.activePortals[0]?.publishedAt || a.advertisement.expiredPortals[0]?.publishedAt || ""
        const bCreatedDate2 =
          b.advertisement.activePortals[0]?.publishedAt || b.advertisement.expiredPortals[0]?.publishedAt || ""
        return new Date(bCreatedDate2).getTime() - new Date(aCreatedDate2).getTime()
      case "expires-asc":
        const aExpiryDate = a.advertisement.activePortals[0]?.expiresAt || ""
        const bExpiryDate = b.advertisement.activePortals[0]?.expiresAt || ""
        return new Date(aExpiryDate).getTime() - new Date(bExpiryDate).getTime()
      case "expires-desc":
        const aExpiryDate2 = a.advertisement.activePortals[0]?.expiresAt || ""
        const bExpiryDate2 = b.advertisement.activePortals[0]?.expiresAt || ""
        return new Date(bExpiryDate2).getTime() - new Date(aExpiryDate2).getTime()
      default:
        return 0
    }
  })

  const renderPortalIcon = (portal: JobPortal) => {
    const Icon = iconMapping[portal.icon as keyof typeof iconMapping]
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
    open: jobPostings.filter((job) => ["active", "inactive", "internal"].includes(job.status)).length,
    active: jobPostings.filter((job) => job.status === "active").length,
    inactive: jobPostings.filter((job) => job.status === "inactive").length,
    internal: jobPostings.filter((job) => job.status === "internal").length,
    archive: jobPostings.filter((job) => job.status === "archive").length,
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full">
        <PageHeader
          title="Nábory"
          activeView={activeView}
          onViewChange={(value) => setActiveView(value)}
          counts={statusCounts}
        />
        <div className="container mx-auto px-4">
          <JobFilters
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            onRecruiterChange={setRecruiterFilter}
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
                                      className={`h-3 w-3 rounded-full ${job.status === "draft" ? "bg-gray-500" : getStatusColor(job.status)}`}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className={job.status === "draft" ? "text-gray-500" : ""}>
                                    {Object.entries(statusMapping).find(([key, value]) => value === job.status)?.[0] ||
                                      job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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
                                            {job.recruiter.additionalRecruiters && (
                                              <Badge variant="secondary" className="px-1">
                                                +{job.recruiter.additionalRecruiters}
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
                                        {job.recruiter.assignedUsers.map((user) => (
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

                        {job.status !== "draft" && (
                          <div className="flex items-center gap-6">
                            <div
                              className={`flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer`}
                            >
                              {getRandomNewCandidates(job.id) && (
                                <div className="absolute -right-1 rounded-full bg-[#E61F60] text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                                  +{getRandomNewCandidates(job.id)}
                                </div>
                              )}
                              <span className="text-lg font-semibold"> {job.candidates.unreviewed}</span>
                              <span className="text-xs text-muted-foreground">Neposouzený</span>
                            </div>
                            <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-lg font-semibold "> {job.candidates.inProgress}</span>
                              <span className="text-xs ">Ve hře</span>
                            </div>
                            <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-lg font-semibold"> {job.candidates.total}</span>
                              <span className="text-xs text-muted-foreground">Celkem</span>
                            </div>
                          </div>
                        )}
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
                    {job.status !== "draft" ? (
                      <div className="pt-2 flex items-center gap-6 px-[48px]">
                        {job.advertisement.activePortals.length > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">17.3 - 17.4</span>
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-1">
                                {job.advertisement.activePortals.map((portal) => (
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
                                        {job.advertisement.activePortals.reduce(
                                          (sum, portal) => sum + (portal.performance?.views || 0),
                                          0,
                                        )}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Celkem shlédnutí</TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        )}

                        {job.advertisement.activePortals.filter((portal) => isExpiringSoon(portal.expiresAt)).length >
                          0 && (
                          <div className="flex items-center gap-3">
                            <HoverCard openDelay={50} className="z-[9999]">
                              <HoverCardTrigger>
                                <div className="flex items-center gap-2 rounded-full bg-amber-100 px-2 py-0.5">
                                  <span className="text-xs font-medium text-amber-800">
                                    {`Zkončí za ${getDaysUntilExpiry(job.advertisement.activePortals.find((portal) => isExpiringSoon(portal.expiresAt))?.expiresAt || "")} ${getDaysUntilExpiry(job.advertisement.activePortals.find((portal) => isExpiringSoon(portal.expiresAt))?.expiresAt || "") === 1 ? "den" : "dny"}`}
                                  </span>
                                  <div className="flex -space-x-1">
                                    {job.advertisement.activePortals
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
                                    {job.advertisement.activePortals
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
                        {job.advertisement.expiredPortals.length > 0 && (
                          <div className="flex items-center gap-3">
                            <HoverCard openDelay={50}>
                              <HoverCardTrigger>
                                <div className="flex items-center gap-2 rounded-full bg-[#FFECEC] px-2 py-0.5">
                                  <span className="text-xs font-medium text-[#9B0000]">
                                    {(() => {
                                      const expiryDates = job.advertisement.expiredPortals.map((p) => p.expiresAt)
                                      const allSameDate = expiryDates.every((date) => date === expiryDates[0])

                                      if (allSameDate && expiryDates.length > 0) {
                                        return `Ukončený od ${formatDate(expiryDates[0])}`
                                      }

                                      return `${job.advertisement.expiredPortals.length} ukončený ${
                                        job.advertisement.expiredPortals.length === 1 ? "inzerát" : "inzeráty"
                                      }`
                                    })()}
                                  </span>
                                  <div className="flex -space-x-1">
                                    {job.advertisement.expiredPortals.slice(0, 3).map((portal) => (
                                      <div
                                        key={portal.url}
                                        className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white"
                                        title={portal.name}
                                      >
                                        {renderPortalIcon(portal)}
                                      </div>
                                    ))}
                                    {job.advertisement.expiredPortals.length > 3 && (
                                      <div
                                        className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#9B0000]/10 bg-white text-xs font-medium"
                                        title="More portals"
                                      >
                                        +{job.advertisement.expiredPortals.length - 3}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-[280px] p-0">
                                <div className="p-2 border-b">
                                  <h4 className="font-medium text-sm">
                                    Ukončené portály ({job.advertisement.expiredPortals.length})
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
                                      {job.advertisement.expiredPortals.map((portal) => (
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
                        {job.advertisement.activePortals.length === 0 &&
                          job.advertisement.expiredPortals.length === 0 && (
                            <div className="flex items-center">
                              <div className="rounded-full bg-gray-100 px-3 py-1">
                                <span className="text-sm text-gray-500">Zatím nevystavený žádný inzerát</span>
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="pt-2 flex items-center gap-6 px-[48px]">
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-100 px-3 py-1">
                            <span className="text-sm text-gray-500">Zatím nezveřejněný inzerát</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedJobForRepublish && (
        <RepublishAdvertsimentModal
          portals={selectedJobForRepublish.advertisement.expiredPortals}
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

