export type JobStatus = "Aktivní" | "Rozpracovaný" | "Archivní" | "Ukončený" | string

export interface JobPortal {
  name: string
  publishedAt: string
  expiresAt: string
  url?: string
  icon?: string
  price?: string
  performance: {
    views: number
    clicks: number
    applications: number
  }
}

export interface UserInfo {
  id: string
  name: string
  role: string
}

export interface JobPosting {
  id: string
  status: JobStatus
  title: string
  location: string
  department?: string
  recruiter: UserInfo
  assignedUsers: UserInfo[]
  candidates: {
    new: number
    inProcess: number
    total: number
  }
  advertisement: {
    active: boolean
    status: string
    portals: JobPortal[]
  }
  performance: {
    views: number
    clicks: number
    applications: number
  }
}

export interface JobPostingsData {
  jobPostings: JobPosting[]
}

export const statusMapping: Record<string, JobStatus> = {
  "Aktivní": "Aktivní",
  "Rozpracovaný": "Rozpracovaný",
  "Archivní": "Archivní",
  "Ukončený": "Ukončený",
}

export const getStatusColor = (status: JobStatus, advertisement?: { active: boolean }) => {
  if (status === "Aktivní") {
    return advertisement?.active ? "bg-green-500" : "bg-yellow-500"
  }
  
  switch (status) {
    case "Rozpracovaný":
      return "bg-yellow-500"
    case "Archivní":
      return "bg-red-500"
    case "Ukončený":
      return "bg-gray-500"
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

