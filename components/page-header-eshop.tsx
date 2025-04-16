"use client"

import { TopHeader } from "@/components/top-header"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/app/contexts/cart-context"

interface PageHeaderEshopProps {
  title: string
}

export function PageHeaderEshop({ title }: PageHeaderEshopProps) {
  const { itemCount } = useCart()

  const openCart = () => {
    // Zde by se implementovalo otevření košíku
    alert("Otevřít košík")
  }

  return (
    <header className="mb-6 flex flex-col flex-gap gap-0 justify-between bg-background drop-shadow-sm">
      <TopHeader userName="Jan Novák" companyName="Acme Corporation s.r.o." />
      <div className="flex items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 ml-auto"
          onClick={openCart}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Košík</span>
          {itemCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-600 text-white">
              {itemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}

