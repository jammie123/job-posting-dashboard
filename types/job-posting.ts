export type JobStatus = "active" | "inactive" | "internal" | "archive" | "draft"

export interface JobPortal {
  name: string
  icon: string
  url: string
  publishedAt: string
  expiresAt: string
  performance?: {
    views: number
    applications: number
  }
}

export interface AssignedUser {
  id: string
  name: string
  image: string
  role: "Náborář" | "Liniový manažer"
  email: string
  department: string
  dateAssigned: string
}

export interface JobPosting {
  id: string
  status: JobStatus
  title: string
  recruiter: {
    name: string
    image: string
    additionalRecruiters?: number
    assignedUsers: AssignedUser[]
  }
  location: string
  candidates: {
    unreviewed: number
    inProgress: number
    total: number
  }
  advertisement: {
    activePortals: JobPortal[]
    expiredPortals: JobPortal[]
  }
}

export interface JobPostingsData {
  jobPostings: JobPosting[]
}

export const statusMapping: Record<string, JobStatus> = {
  Zveřejněný: "active",
  Nezveřejněný: "inactive",
  Interní: "internal",
  Archivovaný: "archive",
  Rozpracovaný: "draft",
}

export const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "inactive":
      return "bg-yellow-500"
    case "internal":
      return "bg-blue-500"
    case "archive":
      return "bg-red-500"
    case "draft":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}

export const iconMapping = {
  JobsPortal: "JobsIcon",
  PracePortal: "PraceIcon",
  CarreerIcon: "CarreerIcon",
  IntranetIcon: "IntranetIcon",
}

