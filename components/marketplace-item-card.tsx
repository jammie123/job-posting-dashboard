"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Info } from "lucide-react"
import { useCart } from "@/app/contexts/cart-context"
import { MarketplaceItem } from "@/data/mock-data"
import { JobsIcon, PraceIcon, CarreerIcon, IntranetIcon } from "@/components/icons"

export interface MarketplaceItemCardProps extends Omit<MarketplaceItem, 'features' | 'package'> {
  title: string
  perex: string
  description: string
  validFrom?: string
  validTo?: string
  howToUse?: string
  upgrade?: string
  progress?: string
  prize?: string
  icon?: string
}

export function MarketplaceItemCard({
  title,
  perex,
  description,
  validFrom,
  validTo,
  howToUse,
  upgrade,
  progress,
  prize,
  icon,
  ...rest
}: MarketplaceItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { addItem } = useCart()

  // Parse progress if available (e.g., "380/500 Kreditů" -> 76%)
  const progressPercentage = progress ? calculateProgress(progress) : null

  function calculateProgress(progressStr: string): number {
    const match = progressStr.match(/(\d+)\/(\d+)/)
    if (match && match.length === 3) {
      const current = Number.parseInt(match[1])
      const total = Number.parseInt(match[2])
      return Math.round((current / total) * 100)
    }
    return 0
  }

  // Function to render the appropriate icon based on the icon string
  const renderIcon = () => {
    if (!icon) return null;
    
    switch (icon.toLowerCase()) {
      case 'jobs':
        return <JobsIcon className="h-10 w-10" />;
      case 'prace':
        return <PraceIcon className="h-10 w-10" />;
      case 'career':
        return <CarreerIcon className="h-10 w-10" />;
      case 'intranet':
        return <IntranetIcon className="h-10 w-10" />;
      default:
        return null;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening modal
    
    // Create a MarketplaceItem object from our props
    const item: MarketplaceItem = {
      title,
      perex,
      description,
      validFrom,
      validTo,
      howToUse,
      upgrade,
      progress,
      ...(prize && { prize }),
      ...(icon && { icon }),
      ...rest
    }
    
    // Add to cart
    addItem(item)
  }

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent default card click behavior
    setIsModalOpen(true)
  }

  return (
    <>
      <div
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:border-blue-500 cursor-pointer relative group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {validFrom && validTo && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2 w-fit absolute top-6 right-6">
                Aktivní
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 mb-3">
          {/* Icon container - always visible */}
          {icon && (
            <div className="flex-shrink-0">
              {renderIcon()}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start w-full">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-1 w-3/4">{perex}</p>
              </div>
              
              <div className="flex items-center gap-8">
                {prize && (
                  <p className="text-md font-semibold text-gray-700 whitespace-nowrap">
                    {prize}
                  </p>
                )}
                
                {/* Action buttons container */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {prize && (
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-400 text-blue-600"
                      onClick={handleAddToCart}
                      title="Přidat do košíku"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Přidat do košíku</span>
                    </Button>
                  )}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto pt-2 space-y-2">

        
          {validFrom && validTo && (
            <p className="text-xs text-gray-500">
              Aktivní: {validFrom} - {validTo}
            </p>
          )}

          {progress && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Využito</span>
                <span>{progress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          )}
        </div>
      
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {icon && (
                <div className="flex-shrink-0">
                  {renderIcon()}
                </div>
              )}
              <span className="text-xl">{title}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-700">{description}</p>

            {prize && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800">Cena</p>
                <p className="text-sm font-semibold text-blue-700">{prize}</p>
              </div>
            )}

            {validFrom && validTo && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700">Aktivní období</p>
                <p className="text-sm text-gray-600">
                  {validFrom} - {validTo}
                </p>
              </div>
            )}

            {progress && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Využití</p>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Využito</span>
                  <span>{progress}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>
            )}

            {howToUse && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Jak to používat</h4>
                <p className="text-sm text-gray-700">{howToUse}</p>
              </div>
            )}

            {upgrade && (
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Upgrade</h4>
                <p className="text-sm text-blue-700">{upgrade}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsModalOpen(false)} variant="outline">
              Zavřít
            </Button>
            {prize && (
              <Button type="button" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Přidat do košíku
              </Button>
            )}
            {!prize && (
              <Button type="button">Mám zájem</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

