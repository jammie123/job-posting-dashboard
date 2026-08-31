"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { JobsIcon, PraceIcon, JobspraceIcon, CarreerIcon, IntranetIcon, AtmoskopIcon, WebpagesIcon, ExportIcon, ProfesiaIcon, PraceZaRohemIcon } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { JobPortal } from "@/types/job-posting"
import { mockProducts } from "@/data/mock-products"
import ReactConfetti from "react-confetti"
import { useState, useEffect } from "react"
import { updateJobHighlight } from "@/lib/job-highlight-service"
import { toast } from "@/components/ui/use-toast"

interface TopAdvertisementModalProps {
  portals?: JobPortal[]
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: (selectedProducts: string[]) => void
  job?: any
}

// Mapování názvů ikon na komponenty
const iconMapping = {
  JobsIcon,
  PraceIcon,
  JobspraceIcon,
  CarreerIcon,
  IntranetIcon,
  AtmoskopIcon,
  WebpagesIcon,
  ExportIcon,
  ProfesiaIcon,
  PraceZaRohemIcon
}

export function TopAdvertisementModal({
  portals = [],
  trigger,
  open,
  onOpenChange,
  onConfirm,
  job,
}: TopAdvertisementModalProps) {
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    // Nastav rozměry okna pro konfety
    if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
  }, [])

  // Seznam portálů, které podporují topování
  const supportedPortals = ["jobs.cz", "prace.cz", "prace za rohem"]
  
  // Filtrování portálů, které podporují topování
  const filteredPortals = portals.filter(portal => {
    const portalName = portal.name.toLowerCase()
    return supportedPortals.some(supportedPortal => portalName.includes(supportedPortal))
  })

  // Mapování názvu portálu na produkty pro topování
  const getTopProductsForPortal = (portalName: string) => {
    const normalizedPortalName = portalName.toLowerCase()
    
    return mockProducts.filter(product => {
      const productPortalName = product.namePortal.toLowerCase()
      
      // Kontrola, jestli produkt patří k správnému portálu a je pro topování
      return (
        productPortalName.includes(normalizedPortalName) && 
        (product.name.toLowerCase().includes("top") || 
         product.name.toLowerCase().includes("aktualizace"))
      )
    })
  }

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId) 
        : [...prev, productId]
    )
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
    return Icon ? <Icon className="h-8 w-8 text-muted-foreground" /> : null
  }

  const handleConfirm = async () => {
    // Přidáme zvýraznění (highlight) do dat portálů
    if (job && job.advertisement && job.advertisement.portals) {
      try {
        // Získej vybrané produkty
        const selectedProductsData = mockProducts.filter(product => selectedProducts.includes(product.id))
        
        // Pro každý vybraný produkt najdi odpovídající portál a přidej zvýraznění
        for (const product of selectedProductsData) {
          const portalName = product.namePortal.toLowerCase()
          
          // Najdi portál, který odpovídá produktu
          const portalIndex = job.advertisement.portals.findIndex(
            (p: any) => p.name.toLowerCase().includes(portalName)
          )
          
          if (portalIndex >= 0) {
            // Získej jméno zvýraznění (poslední slovo z názvu produktu nebo celý název)
            const highlightName = product.name.split(" ").pop() || product.name
            
            // Pošli požadavek na API pro aktualizaci souboru mock-jobs.json
            await updateJobHighlight(job.id, portalName, highlightName)
            
            // Aktualizuj lokální data pro okamžitou odezvu v UI
            job.advertisement.portals[portalIndex].highlighted = {
              name: highlightName
            }
          }
        }
        
        // Zobraz úspěšnou zprávu
        toast({
          title: "Topování úspěšně přidáno",
          description: "Topování inzerátu bylo úspěšně uloženo.",
        })
        
        // Zobraz konfety po úspěšném zvýraznění
        setShowConfetti(true)
        
        // Skryj konfety po 5 sekundách
        setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      } catch (error) {
        console.error("Chyba při aktualizaci topování:", error)
        
        // Zobraz chybovou zprávu
        toast({
          title: "Chyba při topování",
          description: "Nepodařilo se uložit topování inzerátu.",
          variant: "destructive",
        })
      }
    }
    
    onConfirm?.(selectedProducts)
    setSelectedProducts([])
  }

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[800px] w-full">
          <DialogHeader>
            <DialogTitle>Topovat inzerát</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-10">
               Topování zajistí, že váš inzerát bude zobrazen na lepších pozicích ve výsledcích vyhledávání. <a href="#" className="text-blue-500 hover:underline">Více informací o topování v nápovědě</a>
            </p>
            
            <div className="space-y-4">
              {filteredPortals.length === 0 ? (
                <div className="text-center py-8 px-4 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">Nemáte žádné aktivní portály, které podporují topování inzerátů.</p>
                </div>
              ) : (
                filteredPortals.map((portal) => {
                  const topProducts = getTopProductsForPortal(portal.name)
                  const portalHasProducts = topProducts.length > 0
                  
                  return (
                    <div key={portal.url || portal.name} className="space-y-3">
                    

                      {portalHasProducts ? (
                        <div className="flex flex-col gap-3">
                          {topProducts.map((product) => {
                            // Najděme ikonu produktu
                            const ProductIcon = iconMapping[product.logoPortal as keyof typeof iconMapping]
                            
                            return (
                              <Card 
                                key={product.id} 
                                className={`border transition-all duration-200 cursor-pointer ${
                                  selectedProducts.includes(product.id) 
                                    ? 'border-primary ring-2 ring-primary/20' 
                                    : 'hover:border-primary/50'
                                }`}
                                onClick={() => toggleProduct(product.id)}
                              >
                                <CardHeader className="pb-2 flex flex-row items-start space-y-0 gap-3">
                                  <div className="flex-shrink-0 rounded-full bg-muted p-2 flex items-center justify-center">
                                    {ProductIcon && <ProductIcon className="h-8 w-8" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start w-full">
                                      <div className="space-y-1">
                                        <CardTitle className="text-base">{product.name}</CardTitle>
                                        <div className="text-xs text-muted-foreground">{product.namePortal}</div>

                                      </div>
                                      <Checkbox
                                        checked={selectedProducts.includes(product.id)}
                                        onCheckedChange={() => toggleProduct(product.id)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0 pb-1">
                                  <CardDescription className="line-clamp-2 mb-3 pb-1">
                                    {product.description}
                                  </CardDescription>
                                </CardContent>
                                <CardFooter className="pt-0 flex justify-between items-center">
                              
                                  <span className="font-medium text-primary">{product.prize}</span>
                                  {product.dateValidFrom && (
                                          <Badge variant="secondary" className="mt-1 text-xs font-normal">
                                            {product.dateValidTo 
                                              ? `Platné od: ${formatDate(product.dateValidFrom)} do: ${formatDate(product.dateValidTo)}`
                                              : `Platné od: ${formatDate(product.dateValidFrom)}`
                                            }
                                          </Badge>
                                        )}
                                </CardFooter>
                              </Card>
                            )
                          })}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="py-6 text-center">
                            <p className="text-muted-foreground">
                              Pro tento portál nejsou dostupné služby topování.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange?.(false)}>
              Zrušit
            </Button>
            <Button onClick={handleConfirm} disabled={selectedProducts.length === 0}>
              Topovat {selectedProducts.length > 0 ? `(${selectedProducts.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 