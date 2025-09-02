"use client"

import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
// Navbar removed: global Header is provided by app layout
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { items } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/checkout")
    }
  }, [user, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/products")
    }
  }, [items, router])

  if (!user) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to proceed with checkout</p>
          <Link href="/products">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order and get your medications delivered</p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  )
}
