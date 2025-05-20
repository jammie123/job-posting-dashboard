"use client"

import * as React from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { JobPosting, JobPortal } from "@/types/job-posting"

interface RepublishAdvertsimentModalProps {
  portals?: JobPortal[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (selectedPortals: string[], updatedPortals?: JobPortal[]) => void
  jobId?: string // Přidáme ID jobu pro identifikaci v mock-jobs.json
}

const iconMapping = {
  JobsIcon: JobsIcon,
  PraceIcon: PraceIcon,
  CarreerIcon: CarreerIcon,
  IntranetIcon: IntranetIcon,
  AtmoskopIcon: AtmoskopIcon,
  WebpagesIcon: WebpagesIcon,
  ExportIcon: ExportIcon,
  ProfesiaIcon: ProfesiaIcon,
  PraceZaRohemIcon: PraceZaRohemIcon,
  JobspraceIcon: JobspraceIcon,
}

export function RepublishAdvertsimentModal({
  portals = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
  jobId,
}: RepublishAdvertsimentModalProps) {
  const [selectedPortals, setSelectedPortals] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

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

  // Funkce pro získání data za 30 dní v ISO formátu
  const getExpiryISODate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = iconMapping[iconName as keyof typeof iconMapping]
    return Icon ? <Icon className="h-7 w-7 text-muted-foreground" /> : null
  }

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      
      // Aktualizujeme vybrané portály s novými daty
      const currentDate = getCurrentISODate();
      const expiryDate = getExpiryISODate();
      
      const updatedPortals = portals
        .filter(portal => portal.url && selectedPortals.includes(portal.url))
        .map(portal => ({
          ...portal,
          publishedAt: currentDate,
          expiresAt: expiryDate
        }));

      // Pokud máme ID jobu a vybrané portály, pokusíme se aktualizovat data přes API
      if (jobId && selectedPortals.length > 0) {
        const response = await fetch('/api/jobs/republish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobId,
            selectedPortals,
            publishedAt: currentDate,
            expiresAt: expiryDate,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update job data');
        }
        
        toast({
          title: "Inzeráty úspěšně znovuvystaveny",
          description: `${selectedPortals.length} ${selectedPortals.length === 1 ? "inzerát byl" : "inzeráty byly"} úspěšně znovuvystaven${selectedPortals.length === 1 ? "" : "y"}.`,
        });
      }
      
      // Voláme callback s vybranými portály a aktualizovanými daty
      onConfirm?.(selectedPortals, updatedPortals)
      setSelectedPortals([])
    } catch (error) {
      console.error("Error updating job data:", error);
      toast({
        title: "Chyba při znovuvystavení inzerátů",
        description: error instanceof Error ? error.message : "Nepodařilo se aktualizovat data inzerátů. Zkuste to prosím znovu.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Znovu vystavit inzeráty</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Datum znovuvystavení: <strong>{getCurrentFormattedDate()}</strong>
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
                  <TableCell>{getCurrentFormattedDate()}</TableCell>
                  <TableCell>{formatDate(getExpiryISODate())}</TableCell>
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
          <Button variant="ghost" onClick={() => onOpenChange?.(false)} disabled={isLoading}>
            Zrušit
          </Button>
          <Button onClick={handleConfirm} disabled={selectedPortals.length === 0 || isLoading} className={isLoading ? "opacity-70" : ""}>
            {isLoading ? "Zpracovávám..." : `Znovu vystavit ${selectedPortals.length} ${selectedPortals.length === 1 ? "inzerát" : "inzeráty"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

