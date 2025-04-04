import { JobViews } from "@/components/job-views"
import { JobStatus } from "@/types/job-posting"
import { Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TopHeader } from "@/components/top-header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ActiveFilter } from "@/components/job-filters"

interface PageHeaderProps {
  title: string
  activeView?: string
  onViewChange?: (value: string) => void
  counts: Record<string, number>
  activeFilters?: ActiveFilter[]
}

export function PageHeader({ title, activeView = "Aktivní", onViewChange, counts, activeFilters = [] }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background drop-shadow-sm">
      <TopHeader userName="Jan Novák" companyName="Acme Corporation s.r.o." />
      <div className="flex items-center justify-between px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="flex">
          <Button asChild className="rounded-r-none border-r border-primary-blue/80">
            <Link href="/new-position">
              <Plus className="mr-2 h-4 w-4" />
              Nový nábor
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-l-none pl-3 pr-4" variant="default">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/new-position">Nový nábor</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/new-position-simple">Nová brigáda</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <JobViews 
        activeView={activeView} 
        onViewChange={onViewChange} 
        counts={counts}
        activeFilters={activeFilters}
      />
    </header>
  )
}

