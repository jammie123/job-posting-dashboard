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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { JobPosting, JobPortal } from "@/types/job-posting"
import { useToast } from "@/components/ui/use-toast"

interface BulkCancelAdvertProps {
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

export function BulkCancelAdvert({
  selectedJobs = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
}: BulkCancelAdvertProps) {
  const [selectedPortals, setSelectedPortals] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

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
  const { uniquePortals, portalJobCounts, portalExpiryDates } = React.useMemo(() => {
    const allPortals: JobPortal[] = [];
    const counts: Record<string, number> = {};
    const expiryDates: Record<string, Set<string>> = {};
    
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
        
        // Ukládám všechny datumy expirace pro každý portál
        if (!expiryDates[portal.name]) {
          expiryDates[portal.name] = new Set();
        }
        if (portal.expiresAt) {
          expiryDates[portal.name].add(portal.expiresAt);
        }
        
        // Přidávám unikátní portály do seznamu
        const exists = allPortals.some(p => p.name === portal.name);
        if (!exists) {
          allPortals.push(portal);
        }
      });
    });
    
    return { uniquePortals: allPortals, portalJobCounts: counts, portalExpiryDates: expiryDates };
  }, [activeJobs]);

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
      
      // Pokud máme vybrané portály a aktivní inzeráty, pokusíme se aktualizovat data přes API
      if (selectedPortals.length > 0 && activeJobs.length > 0) {
        const cancelDate = getCurrentISODate();
        const jobIds = activeJobs.map(job => job.id);
        
        const response = await fetch('/api/jobs/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobIds,
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
          description: `${selectedPortals.length} ${selectedPortals.length === 1 ? "místo bylo" : "místa byla"} úspěšně ukončeno na ${activeJobs.length} ${activeJobs.length === 1 ? "náboru" : "náborech"}.`,
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

  // Funkce pro zjištění, zda má portál různé datumy expirace
  const hasDifferentExpiryDates = (portalName: string): boolean => {
    return portalExpiryDates[portalName]?.size > 1 || false;
  }

  // Funkce pro získání jednoho data expirace pro zobrazení (pokud jsou všechny stejné)
  const getExpiryDate = (portalName: string): string | undefined => {
    if (!portalExpiryDates[portalName]) return undefined;
    return Array.from(portalExpiryDates[portalName])[0];
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] w-full">
        <DialogHeader>
          <DialogTitle>Hromadně ukončit vystavení inzerátů ({activeJobs.length} náborů)</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {inactiveJobs.length > 0 && (
            <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upozornění</AlertTitle>
              <AlertDescription>
                U {inactiveJobs.length} {inactiveJobs.length === 1 ? "náboru" : "náborů"} nelze ukončit vystavení, protože {inactiveJobs.length === 1 ? "již není aktivní" : "již nejsou aktivní"}:
                <ul className="list-disc pl-5 mt-2">
                  {inactiveJobs.map((job, index) => (
                    <li key={index}>{job.title || `Nábor #${job.id || index + 1}`}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {activeJobs.length === 0 ? (
            <p className="text-center py-4">Nebyly nalezeny žádné aktivní inzeráty, které by bylo možné ukončit.</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Inzeráty budou ukončeny k dnešnímu dni: <strong>{getCurrentFormattedDate()}</strong>
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
                    <TableHead>Plastnost do</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniquePortals.map((portal, index) => {
                    if (!portal.name) return null;
                    
                    // Počet inzerátů pro tento portál
                    const jobsCount = portalJobCounts[portal.name] || 0;
                    
                    return (
                      <TableRow key={`${portal.name}-${index}`}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPortals.includes(portal.name)}
                            onCheckedChange={() => portal.name && togglePortal(portal.name)}
                          />
                        </TableCell>
                        <TableCell>{renderIcon(portal.icon)}</TableCell>
                        <TableCell>{portal.name} ({jobsCount} {jobsCount === 1 ? "inzerát" : jobsCount >= 2 && jobsCount <= 4 ? "inzeráty" : "inzerátů"})</TableCell>
                        <TableCell>
                          {hasDifferentExpiryDates(portal.name) 
                            ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-amber-600 cursor-help">Odlišné platnosti</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Inzeráty na {portal.name} mají různé datumy platnosti
                                </TooltipContent>
                              </Tooltip>
                            )
                            : getExpiryDate(portal.name) 
                              ? formatDate(getExpiryDate(portal.name)!) 
                              : "Neurčeno"
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
            variant="destructive"
            onClick={handleConfirm} 
            disabled={selectedPortals.length === 0 || activeJobs.length === 0 || isLoading}
            className={isLoading ? "opacity-70" : ""}
          >
            {isLoading ? "Zpracovávám..." : `${selectedPortals.length} ${selectedPortals.length === 1 ? "místo bude ukončeno" : "místa budou ukončena"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 