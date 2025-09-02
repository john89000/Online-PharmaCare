"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export function CartMergeHandler() {
  const { user } = useAuth()
  const { mergeGuestCart } = useCart()

  useEffect(() => {
    if (user) {
      // Check if there's a pending cart merge
      const pendingMerge = localStorage.getItem("pharmacy_cart_merge_pending")
      if (pendingMerge) {
        try {
          const guestItems = JSON.parse(pendingMerge)
          mergeGuestCart(guestItems)
          localStorage.removeItem("pharmacy_cart_merge_pending")
        } catch (error) {
          console.error("Failed to merge guest cart:", error)
          localStorage.removeItem("pharmacy_cart_merge_pending")
        }
      }
    }
  }, [user, mergeGuestCart])

  return null // This component doesn't render anything
}
