"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { getStatusColor, statusMapping } from "@/types/job-posting"
import { getJobPostings } from "@/lib/get-job-postings"
import type { JobPosting } from "@/types/job-posting"

// Function to get random new candidates (for demonstration)
const getRandomNewCandidates = (jobId: string): number | null => {
  // Use the job ID as a seed to ensure consistent results
  // Only show new candidates for some jobs (based on job ID)
  if (Number.parseInt(jobId.substring(0, 8), 16) % 3 === 0) {
    return Math.floor(Math.random() * 20) + 1 // Random number between 1-20
  }
  return null
}

export function JobListLineManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch job postings when component mounts
  useEffect(() => {
    async function fetchJobPostings() {
      try {
        const data = await getJobPostings()
        setJobPostings(data.jobPostings)
      } catch (error) {
        console.error("Error fetching job postings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobPostings()
  }, [])

  // Filter jobs based on search query and only include active and inactive positions
  const filteredJobs = jobPostings
    .filter((job) => {
      // Only include active (zveřejněné) and inactive (nezveřejněné) positions
      if (job.status !== "active" && job.status !== "inactive") {
        return false
      }

      // Apply search filter if any
      if (searchQuery && !job.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
    // Limit to a random number between 1 and 10 positions
    .slice(0, Math.floor(Math.random() * 10) + 1)

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full">
        <div className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-2xl font-semibold mb-2">Nábory pro liniové manažery</h1>
          <p className="text-gray-500">Přehled náborů, které spadají pod vaši zodpovědnost</p>
        </div>

        <div className="container mx-auto px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Načítání náborů...</p>
            </div>
          ) : (
            <div className="space-y-2 mt-1">
              {filteredJobs.map((job, index) => (
                <Card key={job.id} className="w-full overflow-hidden">
                  <CardContent className="flex flex-col justify-between items-start p-4">
                    <div className="flex flex-row items-start gap-1 flex-1 justify-between w-full">
                      <div className="flex items-start gap-4 w-full justify-between">
                        <div className="flex items-center gap-12">
                          <div className="flex items-start gap-3">
                            <div className="min-w-[320px] space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold leading-none tracking-tight">{job.title}</h3>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className={`h-3 w-3 rounded-full ${getStatusColor(job.status)}`} />
                                  </TooltipTrigger>
                                  <TooltipContent>
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
                            <span className="text-lg font-semibold"> {job.candidates.unreviewed}</span>
                            <span className="text-xs text-muted-foreground">K ohodnocení</span>
                          </div>
                          <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                            <span className="text-lg font-semibold"> {job.candidates.inProgress}</span>
                            <span className="text-xs">Ve hře</span>
                          </div>
                          <div className="flex flex-col items-center gap-0 hover:bg-gray-100 rounded-lg p-2 relative transition-all duration-100 hover:-translate-y-1 hover:shadow-md cursor-pointer">
                            <span className="text-lg font-semibold"> {job.candidates.total}</span>
                            <span className="text-xs text-muted-foreground">Celkem</span>
                          </div>
                        </div>
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

