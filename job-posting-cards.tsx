"use client"

import { useEffect, useState } from "react"
import { JobPostingList } from "@/components/job-posting-list"
import type { JobPosting } from "@/types/job-posting"
import { getJobPostings } from "@/lib/get-job-postings"

export default function Component() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [dataset, setDataset] = useState<string | undefined>(undefined)

  // Determine dataset from URL/localStorage on client
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

  // Fetch jobs whenever dataset changes
  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      const { jobPostings } = await getJobPostings(dataset)
      if (isMounted) setJobs(jobPostings)
    }
    fetchData()
    const handleDatasetChange = () => {
      try {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search)
          const ds = (params.get('dataset') || window.localStorage.getItem('ui.dataset') || '').trim() || undefined
          setDataset(ds)
        }
      } catch {}
    }
    window.addEventListener('ui:datasetChanged', handleDatasetChange)
    return () => {
      isMounted = false
      window.removeEventListener('ui:datasetChanged', handleDatasetChange)
    }
  }, [dataset])

  return <JobPostingList jobPostings={jobs} />
}

