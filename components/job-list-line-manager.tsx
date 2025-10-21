"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { getStatusColor } from "@/types/job-posting"
import { getJobPostings } from "@/lib/get-job-postings"
import Link from "next/link"
import type { JobPosting } from "@/types/job-posting"
// TopHeader is used by the page, not this component
import { CalendarIcon } from "lucide-react"

// Function to get random new candidates (for demonstration)
const getRandomNewCandidates = (jobId: string): number | null => {
  // Use the job ID as a seed to ensure consistent results
  // Only show new candidates for some jobs (based on job ID)
  if (Number.parseInt(jobId.substring(2, 5), 16) % 3 === 0) {
    return Math.floor(Math.random() * 20) + 1 // Random number between 1-20
  }
  return null
}

// Funkce pro formátování data v českém formátu
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric"
  }).format(date)
}

// Funkce pro získání včerejšího data
const getYesterdayDate = (): Date => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday
}

export function JobListLineManager() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dataset, setDataset] = useState<string | undefined>(undefined)

  // Determine dataset on client to avoid server-side searchParams usage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const ds = (params.get('dataset') || window.localStorage.getItem('ui.dataset') || '').trim() || undefined
        setDataset(ds)
      }
    } catch {
      setDataset(undefined)
    }
  }, [])

  // Fetch job postings when dataset is ready/changes
  useEffect(() => {
    let isMounted = true
    async function fetchJobPostings() {
      try {
        const data = await getJobPostings(dataset)
        if (isMounted) setJobPostings(data.jobPostings)
      } catch (error) {
        console.error("Error fetching job postings:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchJobPostings()
    return () => {
      isMounted = false
    }
  }, [dataset])

  // Filter jobs - pouze aktivní pozice
  const filteredJobs = jobPostings.filter((job) => job.status === "Aktivní" || job.status === "Rozpracovaný")

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full">
        {/* Simplified header with just TopHeader and title */}
        <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background drop-shadow-sm">
        
          <div className="flex items-center justify-between px-6 py-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Nábory 
              <span className="ml-2 text-lg font-normal text-muted-foreground">
                ({filteredJobs.length})
              </span>
            </h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Načítání náborů...</p>
            </div>
          ) : (
            <div className="space-y-2 mt-1">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="w-full overflow-hidden">
                  <CardContent className="flex flex-col justify-between items-start p-4">
                    <div className="flex flex-row items-start gap-1 flex-1 justify-between w-full">
                      <div className="flex items-start gap-4 w-full justify-between">
                        <div className="flex items-center gap-12">
                          <div className="flex items-start gap-3">
                            <div className="min-w-[320px] space-y-1">
                              <div className="flex items-baseline gap-2">
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
                                    <div className="text-primary text-sm mt-1">
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
                                                    .map((part: string) => part[0])
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
                                                  .map((part: string) => part[0])
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
                          <div className="flex items-center gap-6">
                            <div
                              className={`flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer`}
                            >
                              {getRandomNewCandidates(job.id) && (
                                <div className="absolute -right-1 rounded-full bg-[#E61F60] text-white text-xs px-1.5 py-0.5 min-w-[20px] text-center">
                                  +{getRandomNewCandidates(job.id)}
                                </div>
                              )}
                              <span className="text-lg font-semibold">{job.candidates.new}</span>
                              <span className="text-xs text-muted-foreground">K ohodnocení</span>
                            </div>
                            <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-lg font-semibold">{job.candidates.inProcess}</span>
                              <span className="text-xs">Ve hře</span>
                            </div>
                            <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                              <span className="text-lg font-semibold">{job.candidates.total}</span>
                              <span className="text-xs text-muted-foreground">Celkem</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

