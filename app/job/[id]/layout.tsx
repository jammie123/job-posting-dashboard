import jobPostingsData from '@/data/mock-jobs.json'

// Funkce pro generování statických parametrů, vyžadovaná pro použití s "output: export"
export function generateStaticParams() {
  // Vrátime seznam všech ID jobů pro statické generování stránek
  return jobPostingsData.map((job: any) => ({
    id: job.id,
  }))
}

export default function JobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 