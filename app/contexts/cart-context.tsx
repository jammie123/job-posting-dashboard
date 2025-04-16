"use client"

import { createContext, useState, useContext, ReactNode } from "react"
import { MarketplaceItem } from "@/data/mock-data"

interface CartItem extends MarketplaceItem {
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: MarketplaceItem) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: MarketplaceItem) => {
    setItems((prevItems) => {
      // Check if item already exists in cart by title
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.title === item.title
      )

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeItem = (itemTitle: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.title === itemTitle
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        // If quantity > 1, decrement quantity, otherwise remove item
        if (updatedItems[existingItemIndex].quantity > 1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          }
        } else {
          updatedItems.splice(existingItemIndex, 1)
        }
        return updatedItems
      }
      return prevItems
    })
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculate total number of items
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const value = {
    items,
    addItem,
    removeItem,
    clearCart,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 