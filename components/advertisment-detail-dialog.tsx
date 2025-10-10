"use client"

import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { JobPortal } from "@/types/job-posting"
import {
  JobsIcon,
  PraceIcon,
  PraceZaRohemIcon,
  JobspraceIcon,
  CarreerIcon,
  IntranetIcon,
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
} from "@/components/icons"

const iconMapping = {
  JobsIcon,
  PraceIcon,
  JobspraceIcon,
  PraceZaRohemIcon,
  CarreerIcon,
  IntranetIcon,
  LinkedInIcon: PraceIcon,
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
}

const formatDateWithYear = (dateString: string) => {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(dateString))
}

const renderPortalIcon = (portal: JobPortal, sizeClass: string = "h-5 w-5") => {
  const iconKey = portal.icon as keyof typeof iconMapping | undefined
  if (!iconKey || !iconMapping[iconKey]) {
    return <JobsIcon className={`${sizeClass} text-muted-foreground rounded-full`} />
  }
  const Icon = iconMapping[iconKey]
  return <Icon className={`${sizeClass} text-muted-foreground rounded-full`} />
}

interface AdvertismentDetailDialogProps {
  portals: JobPortal[]
  trigger?: ReactNode
  title?: string
  mode?: "dialog" | "hover"
}

export function AdvertismentDetailDialog({ portals, trigger, title = "", mode = "dialog" }: AdvertismentDetailDialogProps) {
  const content = (
    <div className="bg-card">
      <Table className="">
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="">Portál</TableHead>
            <TableHead className=" min-w-[100px]">Vyprší</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portals.map((portal) => (
            <TableRow key={portal.url} className="border-b last:border-b-0 py-1">
              <TableCell className="h-[32px] min-w-[250px] py-0">
                <div className="flex items-center gap-1 py-1">
                  {renderPortalIcon(portal)}
                  <div className="truncate py-1" title={portal.name}>{portal.name}</div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground py-1 w-[150px] max-w-[200px]">
                {portal.expiresAt ? formatDateWithYear(portal.expiresAt) : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (mode === "hover") {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {trigger || (
            <Button variant="secondary" size="sm">Detail inzerce</Button>
          )}
        </HoverCardTrigger>
        <HoverCardContent className="w-fit max-w-[400px] p-2">
          <div className="text-sm font-medium mb-2">{title}</div>
          {content}
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm">Detail inzerce</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-fit max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}


