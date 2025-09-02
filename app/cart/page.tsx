"use client"

import React from "react"
import { useCart } from "@/contexts/cart-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()

  const total = getTotalPrice()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Add products to your cart to see them here.</p>
            <div className="mt-4">
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-sm text-gray-600">{item.product.description}</div>
                    <div className="text-sm text-muted-foreground mt-2">Price: KES {item.product.price}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                      <div className="px-3">{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-sm text-red-600 underline">Remove</button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => clearCart()}>Clear Cart</Button>
              <Link href="/products">
                <Button variant="ghost">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KES {total}</span>
                </div>
                <div className="mt-4">
                  <Link href="/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
