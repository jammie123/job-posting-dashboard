import { getJobPostings } from "@/lib/get-job-postings"
import { JobPostingList } from "@/components/job-posting-list"

export default async function Component() {
  const { jobPostings } = await getJobPostings()
  
  // Log v komponentě zobrazující pracovní pozice
  console.log("=== Data v komponentě Component před renderováním ===")
  console.log(`Počet pracovních pozic: ${jobPostings.length}`)
  console.log("=== Přehled pozic: ===")
  jobPostings.forEach((job, index) => {
    console.log(`${index + 1}. ${job.title} (${job.status}) - ${job.location} - Recruiter: ${job.recruiter.name}`)
  })
  
  return <JobPostingList jobPostings={jobPostings} />
}

