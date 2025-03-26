import { getJobPostings } from "@/lib/get-job-postings"
import { JobPostingList } from "@/components/job-posting-list"

export default async function Component() {
  const { jobPostings } = await getJobPostings()
  return <JobPostingList jobPostings={jobPostings} />
}

