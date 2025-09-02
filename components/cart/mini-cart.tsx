"use client"

import React from "react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCart } from "lucide-react"

export default function MiniCart() {
  const { getTotalItems, getTotalPrice } = useCart()
  const items = getTotalItems()
  const total = getTotalPrice()

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white border shadow-sm rounded-lg p-3 w-44 md:w-56 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <div className="font-medium">Cart</div>
          </div>
          <div className="text-xs text-gray-500">{items} item{items !== 1 ? 's' : ''}</div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-700">Total</div>
          <div className="font-semibold">KES {total}</div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link href="/cart" className="flex-1">
            <button className="w-full text-sm px-2 py-1 border rounded">View</button>
          </Link>
          <Link href="/checkout" className="flex-1">
            <button className="w-full text-sm px-2 py-1 bg-emerald-600 text-white rounded">Buy</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
