"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { JobMenuAction } from "@/components/job-menu-action"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Eye } from "lucide-react"

import type { JobPosting, JobPortal } from "@/types/job-posting"
import { getStatusColor, statusMapping } from "@/types/job-posting"

// Import the useTableVisibility hook at the top
import { useTableVisibility } from "@/contexts/table-visibility-context"

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
    year: "numeric",
  }).format(new Date(dateString))
}

const formatDateWithoutYear = (dateString: string) => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
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

// Update the JobPostingTable component to use the context
export function JobPostingTable({
  jobs,
  bulkActionEnabled = false,
  selectedJobs = [],
  onJobSelect,
}: JobPostingTableProps) {
  // Replace the local state with the context
  const { visibleColumns } = useTableVisibility()

  // Remove the handleAttributesChange function since we're now using context

  const renderPortalIcon = (portal: JobPortal) => {
    const Icon = iconMapping[portal.icon as keyof typeof iconMapping]
    return <Icon className="h-7 w-7 text-muted-foreground hover:text-foreground" />
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
                {visibleColumns.includes("actions") && <TableHead className="w-[30px]"></TableHead>}
                {visibleColumns.includes("title") && <TableHead>Název pozice</TableHead>}
                {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
                {visibleColumns.includes("location") && <TableHead>Lokalita</TableHead>}
                {visibleColumns.includes("recruiter") && <TableHead>Náborář</TableHead>}
                {visibleColumns.includes("advertisement") && <TableHead className="w-[270px]">Inzerce</TableHead>}
                {visibleColumns.includes("unreviewed") && (
                  <TableHead className="text-center min-w-[100px]">Neposouzený</TableHead>
                )}
                {visibleColumns.includes("inProgress") && (
                  <TableHead className="text-center min-w-[100px]">Ve hře</TableHead>
                )}
                {visibleColumns.includes("hired") && (
                  <TableHead className="text-center min-w-[100px]">Nástup</TableHead>
                )}
                {visibleColumns.includes("rejected") && (
                  <TableHead className="text-center min-w-[100px]">Zamítnutí</TableHead>
                )}
                {visibleColumns.includes("total") && (
                  <TableHead className="text-center min-w-[100px]">Celkem kandidátů</TableHead>
                )}
                {visibleColumns.includes("dateCreated") && (
                  <TableHead className="text-center min-w-[100px]">Datum vytvoření</TableHead>
                )}
                {visibleColumns.includes("views") && <TableHead className="text-center">Shlédnutí</TableHead>}
                {visibleColumns.includes("note") && <TableHead>Poznámka</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  {visibleColumns.includes("actions") && (
                    <TableCell>
                      <JobMenuAction job={job} />
                    </TableCell>
                  )}
                  {visibleColumns.includes("title") && (
                    <TableCell className="font-medium min-w-[240px]">{job.title}</TableCell>
                  )}
                  {visibleColumns.includes("status") && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("ml-6")}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`h-3 w-3 rounded-full ${getStatusColor(job.status)}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {getStatusName(job.status)}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("location") && <TableCell>{job.location}</TableCell>}
                  {visibleColumns.includes("recruiter") && (
                    <TableCell>
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
                            {job.recruiter.additionalRecruiters && (
                              <Badge variant="secondary">+{job.recruiter.additionalRecruiters}</Badge>
                            )}
                          </div>
                        </DialogTrigger>
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
                    </TableCell>
                  )}
                  {visibleColumns.includes("advertisement") && (
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {job.advertisement.activePortals.length > 0 && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-3 w-[270px]">
                                <span className="text-sm text-muted-foreground">
                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <span className="cursor-pointer hover:text-foreground transition-colors">
                                        Aktivní od {formatDateWithoutYear(job.advertisement.activePortals[0].publishedAt)} -{" "}
                                        {formatDateWithoutYear(job.advertisement.activePortals[0].expiresAt)}
                                      </span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-[280px] p-0 z-[9999]">
                                      <div className="p-2 border-b">
                                        <h4 className="font-medium text-sm">
                                          Aktivní portály ({job.advertisement.activePortals.length})
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
                                            {job.advertisement.activePortals.map((portal) => (
                                              <tr key={portal.url} className="border-b last:border-0">
                                                <td className="p-2 text-xs">
                                                  <div className="flex items-center gap-2">
                                                    <div className="h-5 w-5">{renderPortalIcon(portal)}</div>
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
                                <div className="flex -space-x-1">
                                  {job.advertisement.activePortals.map((portal) => (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <a
                                          href={portal.url}
                                          className="relative flex h-6 w-6 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0"
                                          title={portal.name}
                                        >
                                          {renderPortalIcon(portal)}
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
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                Vystaveno {formatDate(job.advertisement.activePortals[0].publishedAt)}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {job.advertisement.expiredPortals.length > 0 && (
                          <div className="flex flex-col gap-1 mt-2">
                            {job.advertisement.expiredPortals.map((portal) => (
                              <div key={portal.url} className="flex items-center justify-start gap-2">
                                <span className="text-sm text-[#9B0000]">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-pointer hover:opacity-80 transition-opacity">
                                        Ukončeno {formatDate(portal.expiresAt)}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <span>Zobrazit podrobnosti o ukončené inzerci</span>
                                    </TooltipContent>
                                  </Tooltip>
                                </span>
                                <div className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-background hover:z-10 hover:border-border p-0">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex h-full w-full items-center justify-center">
                                        {renderPortalIcon(portal)}
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
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.includes("unreviewed") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="min-w-[2.5rem] justify-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                      >
                        {job.candidates.unreviewed}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("inProgress") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="min-w-[2.5rem] justify-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {job.candidates.inProgress}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("hired") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="min-w-[2.5rem] justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        {Math.floor(Math.random() * 4)} {/* Random 0-3 */}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("rejected") && (
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="min-w-[2.5rem] justify-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                      >
                        {Math.floor(Math.random() * 4)} {/* Random 0-3 */}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("total") && (
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="min-w-[2.5rem] justify-center">
                        {job.candidates.total}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes("dateCreated") && (
                    <TableCell>
                      <span className="text-sm max-w-[240px]">
                        {formatDate(
                          job.advertisement.activePortals[0]?.publishedAt ||
                            job.advertisement.expiredPortals[0]?.publishedAt ||
                            new Date().toISOString(),
                        )}
                      </span>
                    </TableCell>
                  )}
                  {visibleColumns.includes("views") && (
                    <TableCell className="text-center">
                      {Math.floor(Math.random() * 1000) + 50} {/* Random 50-1050 */}
                    </TableCell>
                  )}
                  {visibleColumns.includes("note") && (
                    <TableCell>
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    </div>
  )
}

