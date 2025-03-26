"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons/index"
import type { JobPortal } from "@/types/job-posting"
import { Checkbox } from "@/components/ui/checkbox"

const iconMapping = {
  JobsIcon,
  PraceIcon,
  CarreerIcon,
  IntranetIcon,
}

interface CancelAdvertismentDialogProps {
  portals: JobPortal[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
}

export function CancelAdvertismentDialog({
  portals,
  trigger,
  open,
  onOpenChange,
  onConfirm,
}: CancelAdvertismentDialogProps) {
  const [selectedPortals, setSelectedPortals] = React.useState<string[]>([])

  const togglePortal = (url: string) => {
    setSelectedPortals((prev) => (prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url]))
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date(dateString))
  }

  const renderIcon = (iconName: string) => {
    const Icon = iconMapping[iconName as keyof typeof iconMapping]
    return <Icon className="h-7 w-7 text-muted-foreground" />
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ukončit vystavení inzerátů</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedPortals.length === portals.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPortals(portals.map((p) => p.url))
                      } else {
                        setSelectedPortals([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Portál</TableHead>
                <TableHead>Datum vystavení</TableHead>
                <TableHead>Datum ukončení</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portals.map((portal) => (
                <TableRow key={portal.url}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPortals.includes(portal.url)}
                      onCheckedChange={() => togglePortal(portal.url)}
                    />
                  </TableCell>
                  <TableCell>{renderIcon(portal.icon)}</TableCell>
                  <TableCell>{portal.name}</TableCell>
                  <TableCell>{formatDate(portal.publishedAt)}</TableCell>
                  <TableCell>{formatDate(portal.expiresAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
            Zrušit
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={selectedPortals.length === 0}>
            {selectedPortals.length} {selectedPortals.length === 1 ? "místo bude ukončeno" : "místa budou ukončena"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

