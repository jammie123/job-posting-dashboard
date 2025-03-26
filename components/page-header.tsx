import { JobViews } from "@/components/job-views"
import { JobStatus } from "@/types/job-posting"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { TopHeader } from "@/components/top-header"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface PageHeaderProps {
  title: string
  activeView?: string
  onViewChange?: (value: string) => void
  counts: Record<string, number>
}

export function PageHeader({ title, activeView = "Aktivní", onViewChange, counts }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background drop-shadow-sm">
      <TopHeader userName="Jan Novák" companyName="Acme Corporation s.r.o." />
      <div className="flex items-center justify-between px-6 pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nový nábor
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/new-position">Varianta 1 - Krokový průvodce</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/new-position-simple">Varianta 2 - Jednoduchý formulář</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <JobViews activeView={activeView} onViewChange={onViewChange} counts={counts} />
    </header>
  )
}

