"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { CartMergeHandler } from "@/components/cart/cart-merge-handler"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <CartMergeHandler />
          {children}
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
