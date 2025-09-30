"use client"

import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
  ProfesiaIcon 
} from "@/components/icons"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { JobMenuAction } from "@/components/job-menu-action"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Eye } from "lucide-react"
import { useTableVisibility } from "@/contexts/table-visibility-context"

import type { JobPosting, JobPortal } from "@/types/job-posting"
import { getStatusColor, statusMapping } from "@/types/job-posting"

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
  ProfesiaIcon
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
  }).format(new Date(dateString))
}

const formatDateWithoutYear = (dateString: string) => {
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

interface JobPostingTableProps {
  jobs: JobPosting[]
  bulkActionEnabled?: boolean
  selectedJobs?: string[]
  onJobSelect?: (jobId: string) => void
}

// Define the JobStatus type
type JobStatus = keyof typeof statusMapping

// Create a reverse mapping to get Czech status names
const getStatusName = (status: JobStatus) => {
  // Find the Czech key for the given English status value
  const czechStatus = Object.entries(statusMapping).find(([_, value]) => value === status)?.[0]
  return czechStatus || status
}

// Helper to get active portals by date (expiresAt in the future)
const getActivePortals = (job: JobPosting) => {
  const now = new Date()
  return job.advertisement.portals.filter((portal) => {
    const expiresAt = new Date(portal.expiresAt)
    return expiresAt >= now
  })
}

// Helper to get expired portals by date (expiresAt in the past)
const getExpiredPortals = (job: JobPosting) => {
  const now = new Date()
  return job.advertisement.portals.filter((portal) => {
    const expiresAt = new Date(portal.expiresAt)
    return expiresAt < now
  })
}

export function JobPostingTable({
  jobs,
  bulkActionEnabled = false,
  selectedJobs = [],
  onJobSelect,
}: JobPostingTableProps) {
  // Use the table visibility context
  const { visibleColumns, columnOrder } = useTableVisibility()

  // Compute the ordered visible columns
  const orderedVisibleColumns = React.useMemo(() => {
    const pinned = ["actions", "title"]
    const preferred = ["unreviewed", "inProgress", "invited", "total"]
    const inOrder = columnOrder.filter((c) => visibleColumns.includes(c))
    const pinnedPresent = pinned.filter((c) => inOrder.includes(c))
    const nonPinned = inOrder.filter((c) => !pinned.includes(c))
    const preferredIndex: Record<string, number> = Object.fromEntries(preferred.map((c, i) => [c, i]))
    const sortedNonPinned = [...nonPinned].sort((a, b) => {
      const ai = preferredIndex[a]
      const bi = preferredIndex[b]
      if (ai !== undefined && bi !== undefined) return ai - bi
      if (ai !== undefined) return -1
      if (bi !== undefined) return 1
      return nonPinned.indexOf(a) - nonPinned.indexOf(b)
    })
    return [...pinnedPresent, ...sortedNonPinned]
  }, [columnOrder, visibleColumns])

  const renderPortalIcon = (portal: JobPortal, sizeClass: string = "h-7 w-7") => {
    if (!portal.icon) {
      return <JobsIcon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />
    }
    
    const iconExists = Object.keys(iconMapping).includes(portal.icon)
    if (!iconExists) {
      return <JobsIcon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />
    }
    
    const Icon = iconMapping[portal.icon as keyof typeof iconMapping]
    
    if (portal.highlighted) {
      return <Icon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />
    }
    
    return <Icon className={`${sizeClass} text-muted-foreground hover:text-foreground rounded-full`} />
  }

  const getRandomNote = () => {
    const notes = [
      "Kandidát má dobré zkušenosti s React a TypeScript.",
      "Potřebujeme najít někoho s lepšími znalostmi Javy.",
      "Tento kandidát by mohl být vhodný pro seniorní pozici.",
      "Pozice vyžaduje cestování, což může být problém pro některé kandidáty.",
      "Hledáme někoho, kdo může nastoupit co nejdříve.",
      "Kandidát má zajímavé portfolio projektů.",
      "Potřebujeme dokončit pohovory do konce měsíce.",
      "Tato pozice má vysokou prioritu pro oddělení.",
      "Kandidát požaduje vyšší plat, než můžeme nabídnout.",
      "Pozice vyžaduje znalost angličtiny na úrovni C1.",
    ]
    return notes[Math.floor(Math.random() * notes.length)]
  }

  return (
    <div>
      <>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                {orderedVisibleColumns.map((col) => {
                  if (col === "actions") return <TableHead key={col} className="w-[30px]"></TableHead>
                  if (col === "title") return <TableHead key={col} className="sticky left-0 z-20 bg-gray-50/80 min-w-[240px]">Název pozice</TableHead>
                  if (col === "status") return <TableHead key={col}>Stav</TableHead>
                  if (col === "location") return <TableHead key={col}>Lokalita</TableHead>
                  if (col === "recruiter") return <TableHead key={col}>Náborář</TableHead>
                  if (col === "advertisement") return <TableHead key={col} className="w-[370px]">Inzerce</TableHead>
                  if (col === "unreviewed") return <TableHead key={col} className="text-center min-w-[80px]">Neposouzený</TableHead>
                  if (col === "inProgress") return <TableHead key={col} className="text-center min-w-[80px]">Ve hře</TableHead>
                  if (col === "total") return <TableHead key={col} className="text-center min-w-[80px]">Celkem</TableHead>
                  if (col === "dateCreated") return <TableHead key={col} className="text-left  min-w-[100px]">Datum vytvoření</TableHead>
                  if (col === "views") return <TableHead key={col} className="text-center">Shlédnutí</TableHead>
                  if (col === "note") return <TableHead key={col}>Poznámka</TableHead>
                  return null
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const activePortals = getActivePortals(job)
                const hasActive = activePortals.length > 0
                const expiredPortals = getExpiredPortals(job)
                const hasExpired = expiredPortals.length > 0

                const getSoonExpiringPortals = (days: number = 7) => {
                  const now = new Date()
                  const soon = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
                  return getActivePortals(job).filter((p) => {
                    const exp = new Date(p.expiresAt)
                    return exp >= now && exp <= soon
                  })
                }
                const soonPortals = getSoonExpiringPortals(7)
                const hasSoon = soonPortals.length > 0
                const hideActiveText = hasActive && hasSoon && soonPortals.length === activePortals.length
                return (
                  <React.Fragment key={job.id}>
                    <TableRow>
                      {orderedVisibleColumns.map((col) => {
                    if (col === "actions") return (
                      <TableCell key={col}>
                        <JobMenuAction job={job} />
                      </TableCell>
                    )
                    if (col === "title") return (
                      <TableCell key={col} className="sticky left-0 z-20 bg-white font-medium min-w-[240px]">{job.title}</TableCell>
                    )
                    if (col === "status") return (
                      <TableCell key={col}>
                        <div className="flex items-center gap-2">
                          <div className={cn("ml-6")}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`h-3 w-3 rounded-full ${getStatusColor(job.status, job.advertisement)}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {getStatusName(job.status)}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </TableCell>
                    )
                    if (col === "location") return <TableCell key={col}>{job.location}</TableCell>
                    if (col === "recruiter") return (
                      <TableCell key={col}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 min-w-[140px]">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs font-medium uppercase">
                                  {job.recruiter.name
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{job.recruiter.name}</span>
                              {job.assignedUsers.length > 1 && (
                                <Badge variant="secondary">+{job.assignedUsers.length - 1}</Badge>
                              )}
                            </div>
                          </DialogTrigger>
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
                      </TableCell>
                    )
                        if (col === "advertisement") return (
                          <TableCell key={col}>
                            <div className="flex flex-col gap-1">
                              {hasActive && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center gap-3 w-[270px]">
                                      {!hideActiveText && (
                                        <span>
                                          <HoverCard>
                                            <HoverCardTrigger asChild>
                                              <span className="inline-flex">
                                                <Badge
                                                  variant="secondary"
                                                  className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                                >
                                                  Běží do {formatDateWithoutYear(activePortals[0].expiresAt)}
                                                </Badge>
                                              </span>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-[280px] p-0 z-[9999]">
                                              <div className="p-2 border-b">
                                                <h4 className="font-medium text-sm">
                                                  Aktivní portály ({activePortals.length})
                                                </h4>
                                              </div>
                                              <div className="max-h-[200px] overflow-y-auto">
                                                <table className="w-full">
                                                  <thead className="sticky top-0 bg-white">
                                                    <tr className="border-b">
                                                      <th className="p-2 text-left text-xs font-medium">Portál</th>
                                                      <th className="p-2 text-left text-xs font-medium">Vystaveno</th>
                                                      <th className="p-2 text-left text-xs font-medium">Vyprší</th>
                                                      <th className="p-2 text-left text-xs font-medium">Zobrazení</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {activePortals.map((portal) => (
                                                      <tr key={portal.url} className="border-b last:border-0">
                                                        <td className="p-2 text-xs">
                                                          <div className="flex items-center gap-2">
                                                            <div className="h-5 w-5 rounded-full overflow-hidden">{renderPortalIcon(portal, "h-5 w-5")}</div>
                                                            {portal.name}
                                                          </div>
                                                        </td>
                                                        <td className="p-2 text-xs">{formatDateWithoutYear(portal.publishedAt)}</td>
                                                        <td className="p-2 text-xs">{formatDateWithoutYear(portal.expiresAt)}</td>
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
                                                >
                                                  Spravovat inzerci
                                                </Button>
                                              </div>
                                            </HoverCardContent>
                                          </HoverCard>
                                        </span>
                                      )}
                                      {!hasExpired && !hideActiveText && (
                                        <div className="flex items-center">
                                          <div className="flex -space-x-1">
                                            {activePortals.slice(0, 4).map((portal) => (
                                              <Tooltip key={portal.url}>
                                                <TooltipTrigger asChild>
                                                  <a
                                                    href={portal.url}
                                                    className="relative flex h-8 w-8 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0"
                                                    title={portal.name}
                                                  >
                                                    {renderPortalIcon(portal, "h-8 w-8")}
                                                  </a>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <div className="flex flex-col gap-1">
                                                    <span className="font-medium">{portal.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                      {formatDateWithoutYear(portal.publishedAt)} - {formatDateWithoutYear(portal.expiresAt)}
                                                    </span>
                                                  </div>
                                                </TooltipContent>
                                              </Tooltip>
                                            ))}
                                          </div>
                                          {activePortals.length > 4 && (
                                            <Badge variant="secondary" className="ml-2">+{activePortals.length - 4}</Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs">
                                      Vystaveno {formatDateWithYear(getActivePortals(job)[0].publishedAt)}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {hasSoon && (
                                <div className="flex items-center gap-3 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                                  >
                                    Končí brzy
                                  </Badge>
                                  <div className="flex items-center">
                                    <div className="flex -space-x-1">
                                      {soonPortals.slice(0, 4).map((portal) => (
                                        <Tooltip key={`soon-inline-${portal.url}`}>
                                          <TooltipTrigger asChild>
                                            <div
                                              className="relative flex h-8 w-8 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0"
                                              title={portal.name}
                                            >
                                              {renderPortalIcon(portal, "h-8 w-8")}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="flex flex-col gap-1">
                                              <span className="font-medium">{portal.name}</span>
                                              <span className="text-xs text-muted-foreground">
                                                Vyprší {formatDateWithoutYear(portal.expiresAt)}
                                              </span>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      ))}
                                    </div>
                                    {soonPortals.length > 4 && (
                                      <Badge variant="secondary" className="ml-2">+{soonPortals.length - 4}</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                              {hasExpired && (
                                <div className="flex items-center gap-3 mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                  >
                                    Ukončeno {formatDateWithoutYear(getExpiredPortals(job)[0].expiresAt)}
                                  </Badge>
                                  <div className="flex items-center">
                                    <div className="flex -space-x-1">
                                      {expiredPortals.slice(0, 4).map((portal) => (
                                        <Tooltip key={`exp-inline-${portal.url}`}>
                                          <TooltipTrigger asChild>
                                            <div
                                              className="relative flex h-8 w-8 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0"
                                              title={portal.name}
                                            >
                                              {renderPortalIcon(portal, "h-8 w-8")}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="flex flex-col gap-1">
                                              <span className="font-medium">{portal.name}</span>
                                              <span className="text-xs text-muted-foreground">
                                                Ukončeno {formatDateWithoutYear(portal.expiresAt)}
                                              </span>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      ))}
                                    </div>
                                    {expiredPortals.length > 4 && (
                                      <Badge variant="secondary" className="ml-2">+{expiredPortals.length - 4}</Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        )
                    if (col === "unreviewed") return (
                      <TableCell key={col} className="text-center">
                        <Badge
                          variant="secondary"
                          className="min-w-[2.5rem] justify-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        >
                          {job.candidates.new}
                        </Badge>
                      </TableCell>
                    )
                    if (col === "inProgress") return (
                      <TableCell key={col} className="text-center">
                        <Badge
                          variant="secondary"
                          className="min-w-[2.5rem] justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {job.candidates.inProcess}
                        </Badge>
                      </TableCell>
                    )
                    if (col === "total") return (
                      <TableCell key={col} className="text-center">
                        <Badge variant="secondary" className="min-w-[2.5rem] justify-center">
                          {job.candidates.total}
                        </Badge>
                      </TableCell>
                    )
                    if (col === "dateCreated") return (
                      <TableCell key={col}>
                        <span className="text-sm max-w-[240px]">
                          {formatDateWithYear(
                            job.advertisement.portals[0]?.publishedAt ||
                              new Date().toISOString()
                          )}
                        </span>
                      </TableCell>
                    )
                    if (col === "views") return (
                      <TableCell key={col} className="text-center">
                        {job.performance?.views || 0}
                      </TableCell>
                    )
                    if (col === "note") return (
                      <TableCell key={col}>
                        <div className="flex gap-2 items-center">
                          <Avatar className="h-6 w-6 mt-0.5">
                            <AvatarFallback className="text-xs font-medium uppercase">
                              {job.recruiter.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground truncate max-w-[240px]">{getRandomNote()}</span>
                        </div>
                      </TableCell>
                    )
                    return null
                      })}
                    </TableRow>
                    

                    
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </>
    </div>
  )
} 