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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { JobPosting, JobPortal } from "@/types/job-posting"

interface BulkExtendModalProps {
  selectedJobs: JobPosting[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (selectedPortals: string[]) => void
}

const iconMapping = {
  JobsIcon: JobsIcon,
  PraceIcon: PraceIcon,
  PraceZaRohemIcon: PraceZaRohemIcon,
  JobspraceIcon: JobspraceIcon,
  CarreerIcon: CarreerIcon,
  IntranetIcon: IntranetIcon,
  AtmoskopIcon: AtmoskopIcon,
  WebpagesIcon: WebpagesIcon,
  ExportIcon: ExportIcon,
  ProfesiaIcon: ProfesiaIcon,
}

export function BulkExtendModal({
  selectedJobs = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
}: BulkExtendModalProps) {
  const [selectedPortals, setSelectedPortals] = React.useState<string[]>([])

  // Filtrujeme aktivní a neaktivní inzeráty
  const { activeJobs, inactiveJobs } = React.useMemo(() => {
    const active: JobPosting[] = [];
    const inactive: JobPosting[] = [];
    
    selectedJobs.forEach(job => {
      if (job.advertisement?.active) {
        active.push(job);
      } else {
        inactive.push(job);
      }
    });
    
    return { activeJobs: active, inactiveJobs: inactive };
  }, [selectedJobs]);

  // Extrahuji jedinečné portály a počítám inzeráty pro každý portál (pouze z aktivních inzerátů)
  const { uniquePortals, portalJobCounts } = React.useMemo(() => {
    const allPortals: JobPortal[] = [];
    const counts: Record<string, number> = {};
    
    activeJobs.forEach(job => {
      if (!job.advertisement?.portals) return;
      
      job.advertisement.portals.forEach(portal => {
        if (!portal || !portal.name) return;
        
        // Počítám výskyty portálů
        if (counts[portal.name]) {
          counts[portal.name]++;
        } else {
          counts[portal.name] = 1;
        }
        
        // Přidávám unikátní portály do seznamu
        const exists = allPortals.some(p => p.name === portal.name);
        if (!exists) {
          allPortals.push(portal);
        }
      });
    });
    
    return { uniquePortals: allPortals, portalJobCounts: counts };
  }, [activeJobs]);

  // Výpočet celkové ceny za všechny vybrané portály
  const totalSelectedPrice = React.useMemo(() => {
    let total = 0;
    
    uniquePortals.forEach((portal: JobPortal) => {
      if (!portal.name || !selectedPortals.includes(portal.name)) return;
      
      const jobsCount = portalJobCounts[portal.name] || 0;
      const portalPrice = portal.price ? 
        parseInt(portal.price.replace(/\D/g, '')) : 1500;
        
      total += portalPrice * jobsCount;
    });
    
    return total;
  }, [uniquePortals, portalJobCounts, selectedPortals]);

  // Výpočet celkového počtu inzerátů na vybraných portálech
  const totalSelectedAdverts = React.useMemo(() => {
    let total = 0;
    
    selectedPortals.forEach(portalName => {
      total += portalJobCounts[portalName] || 0;
    });
    
    return total;
  }, [portalJobCounts, selectedPortals]);

  const togglePortal = (portalName: string) => {
    setSelectedPortals((prev) => 
      prev.includes(portalName) ? prev.filter((p) => p !== portalName) : [...prev, portalName]
    );
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

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = iconMapping[iconName as keyof typeof iconMapping]
    return Icon ? <Icon className="h-7 w-7 text-muted-foreground" /> : null
  }

  const handleConfirm = () => {
    onConfirm?.(selectedPortals)
    setSelectedPortals([])
  }

  // Když se modální okno otevře, nastavíme všechny portály jako vybrané
  // Když se zavře, resetujeme vybrané portály
  React.useEffect(() => {
    if (open) {
      setSelectedPortals(uniquePortals
        .filter(p => p.name)
        .map(p => p.name as string)
      );
    } else {
      setSelectedPortals([]);
    }
  }, [open, uniquePortals]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[800px] w-full">
        <DialogHeader>
          <DialogTitle>Hromadně prodloužit inzeráty ({activeJobs.length} náborů)</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {inactiveJobs.length > 0 && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upozornění</AlertTitle>
              <AlertDescription>
                U {inactiveJobs.length} {inactiveJobs.length === 1 ? "náboru" : "náborů"} nelze prodloužit inzerci, protože {inactiveJobs.length === 1 ? "již není aktivní" : "již nejsou aktivní"}:
                <ul className="list-disc pl-5 mt-2">
                  {inactiveJobs.map((job, index) => (
                    <li key={index}>{job.title || `Nábor #${job.id || index + 1}`}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {activeJobs.length === 0 ? (
            <p className="text-center py-4">Nebyly nalezeny žádné aktivní inzeráty, které by bylo možné prodloužit.</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Prodloužení inzerce provedeme podle původního nastavení inzerce. Datum prodloužení: <strong>{getCurrentFormattedDate()}</strong>
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedPortals.length === uniquePortals.length && uniquePortals.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPortals(uniquePortals
                              .filter(p => p.name)
                              .map(p => p.name as string)
                            );
                          } else {
                            setSelectedPortals([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Portál</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Počet inzerátů</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniquePortals.map((portal, index) => {
                    if (!portal.name) return null;
                    
                    // Počet inzerátů pro tento portál
                    const jobsCount = portalJobCounts[portal.name] || 0;
                    
                    // Celková cena za všechny inzeráty na tomto portálu
                    const portalPrice = portal.price ? 
                      parseInt(portal.price.replace(/\D/g, '')) : 1500;
                    const totalPrice = `${portalPrice * jobsCount} Kč`;
                    
                    return (
                      <TableRow key={`${portal.name}-${index}`}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPortals.includes(portal.name)}
                            onCheckedChange={() => portal.name && togglePortal(portal.name)}
                          />
                        </TableCell>
                        <TableCell>{renderIcon(portal.icon)}</TableCell>
                        <TableCell>{portal.name}</TableCell>
                        <TableCell>{totalPrice}</TableCell>
                        <TableCell>{jobsCount}</TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Řádek se součtem ceny */}
                  {uniquePortals.length > 0 && (
                    <TableRow className="font-medium bg-muted/20">
                      <TableCell colSpan={3} className="text-left">
                        Celková cena za vybrané portály:
                      </TableCell>
                      <TableCell>{totalSelectedPrice > 0 ? `${totalSelectedPrice} Kč` : "0 Kč"}</TableCell>
                      <TableCell>{totalSelectedAdverts}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
            Zrušit
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={selectedPortals.length === 0 || activeJobs.length === 0}
          >
            Prodloužit na {selectedPortals.length} {selectedPortals.length === 1 ? "portálu" : "portálech"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 