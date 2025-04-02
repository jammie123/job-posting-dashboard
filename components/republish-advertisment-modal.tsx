"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons/index"
import { Checkbox } from "@/components/ui/checkbox"
import type { JobPortal } from "@/types/job-posting"

interface RepublishAdvertsimentModalProps {
  portals?: JobPortal[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (selectedPortals: string[]) => void
}

const iconMapping = {
  JobsIcon: JobsIcon,
  PraceIcon: PraceIcon,
  CarreerIcon: CarreerIcon,
  IntranetIcon: IntranetIcon,
}

export function RepublishAdvertsimentModal({
  portals = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
}: RepublishAdvertsimentModalProps) {
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

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = iconMapping[iconName as keyof typeof iconMapping]
    return Icon ? <Icon className="h-7 w-7 text-muted-foreground" /> : null
  }

  const handleConfirm = () => {
    onConfirm?.(selectedPortals)
    setSelectedPortals([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Znovu vystavit inzeráty</DialogTitle>
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
                        setSelectedPortals(portals.filter(p => p.url).map(p => p.url as string))
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
                <TableHead>Cena</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portals.map((portal) => (
                <TableRow key={portal.url || 'unknown'}>
                  <TableCell>
                    <Checkbox
                      checked={portal.url ? selectedPortals.includes(portal.url) : false}
                      onCheckedChange={() => portal.url && togglePortal(portal.url)}
                    />
                  </TableCell>
                  <TableCell>{renderIcon(portal.icon)}</TableCell>
                  <TableCell>{portal.name}</TableCell>
                  <TableCell>{portal.publishedAt ? formatDate(portal.publishedAt) : '-'}</TableCell>
                  <TableCell>{portal.expiresAt ? formatDate(portal.expiresAt) : '-'}</TableCell>
                  <TableCell>{portal.price || "1 500 Kč"}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={6} className="text-center p-4 ">
                  <Button
                    variant="outline"
                    className="w-full h-auto"
                    onClick={() => {
                      onOpenChange?.(false)
                      window.location.href = "/advertisement-page"
                    }}
                  >
                    <div className="flex flex-col items-center p-4">
                      <span>Přidat další inzerát</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Přejdete na stránku kde vyberete další místa vystavení
                      </span>
                    </div>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
            Zrušit
          </Button>
          <Button onClick={handleConfirm} disabled={selectedPortals.length === 0}>
            Znovu vystavit {selectedPortals.length} {selectedPortals.length === 1 ? "inzerát" : "inzeráty"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

