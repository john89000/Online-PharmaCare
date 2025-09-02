"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Navbar } from "@/components/layout/navbar"
import { MpesaPayment } from "@/components/payment/mpesa-payment"
import { StripePayment } from "@/components/payment/stripe-payment"
import { OrderService } from "@/services/payment-service"
import type { Order } from "@/types/order"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, ArrowLeft, CreditCard, Smartphone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface PaymentPageProps {
  params: {
    orderId: string
  }
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { user } = useAuth()
  const { clearCart } = useCart()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "stripe">("mpesa")
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [transactionId, setTransactionId] = useState<string>("")

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Load order from localStorage (in real app, this would be an API call)
    const orders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    const foundOrder = orders.find((o: Order) => o.id === params.orderId)

    if (!foundOrder) {
      router.push("/products")
      return
    }

    setOrder(foundOrder)
    setPaymentMethod(foundOrder.paymentInfo.method)
  }, [user, params.orderId, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const handlePaymentComplete = async (success: boolean, txnId?: string) => {
    if (success && order) {
      setPaymentCompleted(true)
      setTransactionId(txnId || "")

      // Update order status
      await OrderService.updateOrderStatus(order.id, "confirmed")

      // Clear cart
      clearCart()

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/order-success/${order.id}`)
      }, 3000)
    }
  }

  if (!user || !order) {
    return null
  }

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">Your order has been confirmed and will be processed shortly.</p>
          {transactionId && (
            <div className="mb-6">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Transaction ID: {transactionId}
              </Badge>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Redirecting to order confirmation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/checkout" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose how you'd like to pay for your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={paymentMethod === "mpesa" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("mpesa")}
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <Smartphone className="h-6 w-6 mb-1" />
                    <span className="text-sm">M-Pesa</span>
                  </Button>
                  <Button
                    variant={paymentMethod === "stripe" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("stripe")}
                    className="h-16 flex flex-col items-center justify-center"
                  >
                    <CreditCard className="h-6 w-6 mb-1" />
                    <span className="text-sm">Card</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Component */}
            {paymentMethod === "mpesa" ? (
              <MpesaPayment
                phone={order.paymentInfo.mpesaPhone || order.shippingInfo.phone}
                amount={order.finalTotal}
                orderId={order.id}
                onPaymentComplete={handlePaymentComplete}
              />
            ) : (
              <StripePayment amount={order.finalTotal} orderId={order.id} onPaymentComplete={handlePaymentComplete} />
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
                <CardDescription>Order #{order.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 rounded overflow-hidden">
                        <Image
                          src={item.productImage || "/placeholder.svg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Shipping Info */}
                <div className="space-y-2">
                  <h4 className="font-medium">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.shippingInfo.fullName}</p>
                    <p>{order.shippingInfo.address}</p>
                    <p>
                      {order.shippingInfo.city}, {order.shippingInfo.postalCode}
                    </p>
                    <p>{order.shippingInfo.phone}</p>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-emerald-600">{formatPrice(order.finalTotal)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
