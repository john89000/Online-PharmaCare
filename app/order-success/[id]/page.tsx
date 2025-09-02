"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  items: Array<{ productId: string; productName: string; quantity: number; price: number; productImage?: string }>
  finalTotal: number
  shippingInfo: { fullName: string; phone?: string; address?: string }
}

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    const found = allOrders.find((o: Order) => o.id === params.id)
    if (found) setOrder(found)
  }, [params.id])

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <p className="mt-2 text-muted-foreground">We couldn't find the order. If you were redirected here after payment, please check your email for confirmation or contact support.</p>
          <div className="mt-6">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-600" />
          <h1 className="text-2xl font-bold mt-4">Thank you — your payment was successful!</h1>
          <p className="mt-2 text-muted-foreground">We've received your order and are preparing it for delivery.</p>

          <div className="mt-6 text-left">
            <h3 className="font-medium">Order #{order.id}</h3>
            <p className="text-sm text-muted-foreground">Recipient: {order.shippingInfo.fullName}{order.shippingInfo.phone ? ` • ${order.shippingInfo.phone}` : ''}</p>

            <div className="mt-4 space-y-3">
              {order.items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={it.productImage || "/placeholder.svg"} alt={it.productName} className="h-12 w-12 rounded object-cover" />
                    <div>
                      <div className="font-medium">{it.productName}</div>
                      <div className="text-sm text-muted-foreground">Qty: {it.quantity}</div>
                    </div>
                  </div>
                  <div className="font-medium">KSh {Number(it.price * it.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-medium">Total paid</span>
              <span className="text-lg font-semibold text-emerald-600">KSh {Number(order.finalTotal).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">What's next:</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mx-auto text-left max-w-md">
              <li>You'll receive an email confirmation with your order details.</li>
              <li>We will notify you when your order is dispatched with tracking information.</li>
              <li>If you have questions, reply to the confirmation email or contact our support.</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link href="/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
            <Link href="/products">
              <Button className="bg-emerald-600">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
