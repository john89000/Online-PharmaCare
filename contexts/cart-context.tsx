"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product, CartItem } from "@/types/product"
import { useAuth } from "@/contexts/auth-context"

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  mergeGuestCart: (guestItems: CartItem[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user } = useAuth()

  const getCartKey = () => {
    return user ? `pharmacy_cart_${user.id}` : "pharmacy_cart_guest"
  }

  useEffect(() => {
    const cartKey = getCartKey()
    const savedCart = localStorage.getItem(cartKey)
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [user]) // Re-run when user changes

  useEffect(() => {
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(items))
  }, [items, user])

  const mergeGuestCart = (guestItems: CartItem[]) => {
    if (guestItems.length === 0) return

    setItems((currentItems) => {
      const mergedItems = [...currentItems]

      guestItems.forEach((guestItem) => {
        const existingItemIndex = mergedItems.findIndex((item) => item.product.id === guestItem.product.id)

        if (existingItemIndex >= 0) {
          // Item exists, add quantities
          mergedItems[existingItemIndex].quantity += guestItem.quantity
        } else {
          // New item, add to cart
          mergedItems.push(guestItem)
        }
      })

      return mergedItems
    })

    localStorage.removeItem("pharmacy_cart_guest")
  }

  const addToCart = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...currentItems, { product, quantity }]
      }
    })
    setIsCartOpen(true) // Open cart when item is added
  }

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isCartOpen,
        setIsCartOpen,
        mergeGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
