import type { JobPosting, JobStatus } from "@/types/job-posting"

// Update the statuses array to include "draft"
const statuses: JobStatus[] = ["active", "inactive", "internal", "archive", "draft"]

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UX Designer",
  "Product Manager",
  "Data Analyst",
  "Software Engineer",
  "QA Engineer",
  "Project Manager",
  "Business Analyst",
  "System Administrator",
  "Network Engineer",
  "Security Engineer",
  "Mobile Developer",
  "Cloud Architect",
  "Data Scientist",
  "Machine Learning Engineer",
  "Technical Writer",
  "Scrum Master",
]

const levels = ["Junior", "Mid-level", "Senior", "Lead", "Principal"]

const locations = ["Prague", "Brno", "Ostrava", "Remote", "Plzeň", "Olomouc", "Liberec", "Hradec Králové"]

// Definice hodnot pro oddělení
const departments = ["Centrála", "Servis", "Sales"]

const recruiterNames = [
  "Anna K.",
  "Martin H.",
  "Petra N.",
  "Jan B.",
  "Eva M.",
  "Tomáš R.",
  "Lucie S.",
  "David P.",
  "Markéta V.",
  "Filip K.",
]

function generatePerformanceMetrics() {
  return {
    views: Math.floor(Math.random() * 1000) + 100, // 100-1100 views
    applications: Math.floor(Math.random() * 50) + 1, // 1-50 applications
  }
}

function generateRandomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
}

function generateSoonExpiringDate() {
  const today = new Date()
  const daysToAdd = Math.floor(Math.random() * 7) + 1 // 1-7 days from now
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + daysToAdd)
  return futureDate.toISOString().split("T")[0]
}

function generateRecentDate() {
  const today = new Date()
  const daysAgo = Math.floor(Math.random() * 5) // 0-4 days ago
  const recentDate = new Date(today)
  recentDate.setDate(today.getDate() - daysAgo)
  return recentDate.toISOString().split("T")[0]
}

function generateAssignedUsers(recruiterName: string, count: number) {
  const users = []
  const [firstName, lastName] = recruiterName.split(" ")

  users.push({
    id: `au${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName.replace(".", "ová")}`,
    image: "/placeholder.svg",
    role: "Náborář" as const,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.cz`,
    department: "HR",
    dateAssigned: generateRandomDate(new Date("2024-01-01"), new Date()),
  })

  for (let i = 1; i < count; i++) {
    const isManager = Math.random() > 0.7
    const randomName = `${["Jan", "Petr", "Martin", "Pavel", "Tomáš"][Math.floor(Math.random() * 5)]} ${
      ["Novák", "Svoboda", "Dvořák", "Černý", "Procházka"][Math.floor(Math.random() * 5)]
    }`

    users.push({
      id: `au${Math.random().toString(36).substr(2, 9)}`,
      name: randomName,
      image: "/placeholder.svg",
      role: isManager ? "Liniový manažer" : "Náborář",
      email: randomName.toLowerCase().replace(" ", ".") + "@company.cz",
      department: isManager ? "Engineering" : "HR",
      dateAssigned: generateRandomDate(new Date("2024-01-01"), new Date()),
    })
  }

  return users
}

export function generateMockJobPostings(count: number): JobPosting[] {
  const jobPostings: JobPosting[] = []

  // First, create some recent job postings (about 30% of total)
  const recentCount = Math.floor(count * 0.3)

  for (let i = 0; i < recentCount; i++) {
    const status = "active" // Recent postings are typically active
    const level = levels[Math.floor(Math.random() * levels.length)]
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)]
    // Prefer "Anna K." as recruiter for recent postings
    const recruiter =
      Math.random() < 0.8 ? "Anna K." : recruiterNames[Math.floor(Math.random() * recruiterNames.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]

    const assignedUsersCount = Math.floor(Math.random() * 4) + 1
    const assignedUsers = generateAssignedUsers(recruiter, assignedUsersCount)

    const activePortals = []
    const expiredPortals = []

    // Generate 1-3 active portals with very recent publish dates
    const portalCount = Math.floor(Math.random() * 3) + 1

    for (let p = 0; p < portalCount; p++) {
      const portalNames = ["JobsPortal", "PracePortal", "CarreerPortal"]
      const portalIcons = ["JobsIcon", "PraceIcon", "CarreerIcon"]

      const portalIndex = p % 3
      activePortals.push({
        name: portalNames[portalIndex],
        icon: portalIcons[portalIndex],
        url: "#",
        publishedAt: generateRecentDate(), // Very recent date
        expiresAt: generateRandomDate(new Date(new Date().setDate(new Date().getDate() + 14)), new Date("2024-04-01")),
        performance: generatePerformanceMetrics(),
      })
    }

    const posting: JobPosting = {
      id: (i + 1).toString(),
      status,
      title: `${level} ${title}`,
      recruiter: {
        name: recruiter,
        image: "/placeholder.svg",
        additionalRecruiters: assignedUsersCount > 1 ? assignedUsersCount - 1 : undefined,
        assignedUsers,
      },
      location,
      department: departments[Math.floor(Math.random() * departments.length)],
      candidates: {
        unreviewed: Math.floor(Math.random() * 15),
        inProgress: Math.floor(Math.random() * 10),
        total: Math.floor(Math.random() * 40) + 5,
      },
      advertisement: {
        activePortals,
        expiredPortals,
      },
    }

    jobPostings.push(posting)
  }

  // Then create the rest of the job postings with older dates
  for (let i = recentCount; i < count; i++) {
    // Make some jobs have the "draft" status (about 15% of the remaining jobs)
    const status = i % 7 === 0 ? "draft" : statuses[Math.floor(Math.random() * statuses.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)]
    // Prefer "Anna K." as recruiter (70% chance)
    const recruiter =
      Math.random() < 0.7 ? "Anna K." : recruiterNames[Math.floor(Math.random() * recruiterNames.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]

    const assignedUsersCount = Math.floor(Math.random() * 4) + 1
    const assignedUsers = generateAssignedUsers(recruiter, assignedUsersCount)

    const hasActivePortals = status !== "archive" && status !== "inactive"
    const hasExpiredPortals = Math.random() > 0.5
    const hasSoonExpiringPortals = hasActivePortals && Math.random() > 0.7

    const activePortals = []
    const expiredPortals = []

    if (hasActivePortals) {
      if (status === "internal") {
        activePortals.push({
          name: "Intranet",
          icon: "IntranetIcon",
          url: "#",
          publishedAt: generateRandomDate(new Date("2024-01-01"), new Date("2024-02-15")), // Older date
          expiresAt: generateRandomDate(new Date(), new Date("2024-04-01")),
          performance: generatePerformanceMetrics(),
        })
      } else {
        const JobsPortal = {
          name: "JobsPortal",
          icon: "JobsIcon",
          url: "#",
          publishedAt: generateRandomDate(new Date("2024-01-01"), new Date("2024-02-15")), // Older date
          expiresAt: hasSoonExpiringPortals
            ? generateSoonExpiringDate()
            : generateRandomDate(new Date(), new Date("2024-04-01")),
          performance: generatePerformanceMetrics(),
        }
        activePortals.push(JobsPortal)

        if (Math.random() > 0.5) {
          const PracePortal = {
            name: "PracePortal",
            icon: "PraceIcon",
            url: "#",
            publishedAt: generateRandomDate(new Date("2024-01-01"), new Date("2024-02-15")), // Older date
            expiresAt:
              Math.random() > 0.7 && hasSoonExpiringPortals
                ? generateSoonExpiringDate()
                : generateRandomDate(new Date(), new Date("2024-04-01")),
            performance: generatePerformanceMetrics(),
          }
          activePortals.push(PracePortal)
        }

        if (Math.random() > 0.7) {
          const CarreerPortal = {
            name: "CarreerPortal",
            icon: "CarreerIcon",
            url: "#",
            publishedAt: generateRandomDate(new Date("2024-01-01"), new Date("2024-02-15")), // Older date
            expiresAt:
              Math.random() > 0.7 && hasSoonExpiringPortals
                ? generateSoonExpiringDate()
                : generateRandomDate(new Date(), new Date("2024-04-01")),
            performance: generatePerformanceMetrics(),
          }
          activePortals.push(CarreerPortal)
        }
      }
    }

    if (hasExpiredPortals && status !== "internal") {
      expiredPortals.push({
        name: Math.random() > 0.5 ? "JobsPortal" : "PracePortal",
        icon: Math.random() > 0.5 ? "JobsIcon" : "PraceIcon",
        url: "#",
        publishedAt: generateRandomDate(new Date("2023-12-01"), new Date("2024-01-15")),
        expiresAt: generateRandomDate(new Date("2024-01-16"), new Date("2024-02-01")),
        performance: generatePerformanceMetrics(),
      })
    }

    const posting: JobPosting = {
      id: (i + 1).toString(),
      status,
      title: `${level} ${title}`,
      recruiter: {
        name: recruiter,
        image: "/placeholder.svg",
        additionalRecruiters: assignedUsersCount > 1 ? assignedUsersCount - 1 : undefined,
        assignedUsers,
      },
      location,
      department: departments[Math.floor(Math.random() * departments.length)],
      candidates: {
        unreviewed: status === "active" ? Math.floor(Math.random() * 15) : 0,
        inProgress: ["active", "internal"].includes(status) ? Math.floor(Math.random() * 10) : 0,
        total: Math.floor(Math.random() * 40) + 5,
      },
      advertisement: {
        activePortals,
        expiredPortals,
      },
    }

    jobPostings.push(posting)
  }

  // Ensure at least 2 jobs have completely expired job boards
  const expiredJobsCount = jobPostings.filter(
    (job) => job.advertisement.activePortals.length === 0 && job.advertisement.expiredPortals.length > 0,
  ).length

  // If we don't have at least 2 expired jobs, modify some existing jobs
  if (expiredJobsCount < 2) {
    // Find how many more expired jobs we need
    const neededExpiredJobs = 2 - expiredJobsCount

    // Get some active jobs to convert to expired
    const jobsToModify = jobPostings
      .filter((job) => job.advertisement.activePortals.length > 0)
      .slice(0, neededExpiredJobs)

    // Convert these jobs to have only expired portals
    jobsToModify.forEach((job) => {
      // Move all active portals to expired portals
      job.advertisement.expiredPortals = [
        ...job.advertisement.expiredPortals,
        ...job.advertisement.activePortals.map((portal) => ({
          ...portal,
          publishedAt: generateRandomDate(new Date("2023-12-01"), new Date("2024-01-15")),
          expiresAt: generateRandomDate(new Date("2024-01-16"), new Date("2024-02-01")),
        })),
      ]

      // Clear active portals
      job.advertisement.activePortals = []

      // Set status to inactive
      job.status = "inactive"
    })
  }

  // Sort the job postings by the most recent publishedAt date
  return jobPostings.sort((a, b) => {
    const aDate =
      a.advertisement.activePortals[0]?.publishedAt || a.advertisement.expiredPortals[0]?.publishedAt || "2000-01-01"

    const bDate =
      b.advertisement.activePortals[0]?.publishedAt || b.advertisement.expiredPortals[0]?.publishedAt || "2000-01-01"

    return new Date(bDate).getTime() - new Date(aDate).getTime() // Descending order (newest first)
  })
}

