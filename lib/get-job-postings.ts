import { generateMockJobPostings } from "./generate-mock-data"
import type { JobPostingsData } from "@/types/job-posting"

export async function getJobPostings(): Promise<JobPostingsData> {
  // Generate 30 mock job postings
  const jobPostings = generateMockJobPostings(30)
  return { jobPostings }
}

