"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  ProfesiaIcon 
} from "@/components/icons"
import type { JobPortal } from "@/types/job-posting"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

const iconMapping = {
  JobsIcon,
  PraceIcon,
  CarreerIcon,
  IntranetIcon,
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
  PraceZaRohemIcon,
  JobspraceIcon,
}

interface CancelAdvertismentDialogProps {
  portals?: JobPortal[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (selectedPortals: string[]) => void
  jobId?: string
}

export function CancelAdvertismentDialog({
  portals = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
  jobId,
}: CancelAdvertismentDialogProps) {
  const [selectedPortals, setSelectedPortals] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  // Při otevření modálního okna nastavíme všechny portály jako vybrané
  React.useEffect(() => {
    if (open) {
      setSelectedPortals(portals.filter(p => p.url).map(p => p.url as string));
    } else {
      setSelectedPortals([]);
    }
  }, [open, portals]);

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

  // Funkce pro získání aktuálního data ve formátovaném tvaru
  const getCurrentFormattedDate = () => {
    return new Intl.DateTimeFormat("cs-CZ", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(new Date())
  }

  // Funkce pro získání aktuálního data v ISO formátu
  const getCurrentISODate = () => {
    return new Date().toISOString().split('T')[0];
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = iconMapping[iconName as keyof typeof iconMapping]
    return Icon ? <Icon className="h-7 w-7 text-muted-foreground" /> : null
  }

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Pokud máme ID jobu a vybrané portály, pokusíme se aktualizovat data přes API
      if (jobId && selectedPortals.length > 0) {
        const cancelDate = getCurrentISODate();
        
        const response = await fetch('/api/jobs/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            selectedPortals,
            cancelDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update job data');
        }
        
        toast({
          title: "Inzeráty úspěšně ukončeny",
          description: `${selectedPortals.length} ${selectedPortals.length === 1 ? "místo bylo" : "místa byla"} úspěšně ukončeno.`,
        });
      }
      
      // Voláme callback s vybranými portály
      onConfirm?.(selectedPortals)
      setSelectedPortals([])
      onOpenChange?.(false)
    } catch (error) {
      console.error("Error updating job data:", error);
      toast({
        title: "Chyba při ukončení inzerátů",
        description: error instanceof Error ? error.message : "Nepodařilo se ukončit inzeráty. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ukončit vystavení inzerátů</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Datum ukončení vystavení: <strong>{getCurrentFormattedDate()}</strong>
          </p>
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
                <TableHead>Datum ukončení</TableHead>
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
                  <TableCell className="flex flex-col">
                    {getCurrentFormattedDate()}
                    <span className="text-xs text-muted-foreground">
                      Inzerát můžete obnovit do {portal.expiresAt ? formatDate(portal.expiresAt) : '-'}
                    </span>
                    {portal.cancelAt && (
                      <span className="text-xs text-amber-600">
                        Dříve ukončeno: {formatDate(portal.cancelAt)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)} disabled={isLoading}>
            Zrušit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm} 
            disabled={selectedPortals.length === 0 || isLoading}
            className={isLoading ? "opacity-70" : ""}
          >
            {isLoading ? "Zpracovávám..." : `${selectedPortals.length} ${selectedPortals.length === 1 ? "místo bude ukončeno" : "místa budou ukončena"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

