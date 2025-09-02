"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
// Navbar removed: global Header is provided by app layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, MapPin, CreditCard, FileText, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Order } from "@/types/order"

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/orders")
      return
    }

    // Load order from localStorage
    const allOrders = JSON.parse(localStorage.getItem("pharmacy_orders") || "[]")
    const foundOrder = allOrders.find((o: Order) => o.id === params.id && o.userId === user.id)

    if (!foundOrder) {
      router.push("/orders")
      return
    }

    setOrder(foundOrder)
    setIsLoading(false)
  }, [user, params.id, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-indigo-100 text-indigo-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderProgress = (status: string) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Clock },
      { key: "confirmed", label: "Confirmed", icon: CheckCircle },
      { key: "processing", label: "Processing", icon: Package },
      { key: "shipped", label: "Shipped", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle },
    ]

    const currentIndex = steps.findIndex((step) => step.key === status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }))
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  const progressSteps = getOrderProgress(order.status)

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-lg px-4 py-2`}>
              <span className="capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
                <CardDescription>Track your order status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressSteps.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            step.completed
                              ? "bg-emerald-600 text-white"
                              : step.current
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p
                            className={`font-medium ${
                              step.completed || step.current ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>
                        {index < progressSteps.length - 1 && (
                          <div className={`w-px h-8 ml-5 ${step.completed ? "bg-emerald-600" : "bg-gray-200"}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Items Ordered ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 py-4 border-b last:border-b-0">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={item.productImage || "/placeholder.svg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        {item.requiresPrescription && (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 mt-1">
                            <FileText className="w-3 h-3 mr-1" />
                            Prescription Required
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingInfo.fullName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>
                    {order.shippingInfo.city}, {order.shippingInfo.postalCode}
                  </p>
                  <p>{order.shippingInfo.phone}</p>
                  <p>{order.shippingInfo.email}</p>
                </div>
                {order.deliveryInstructions && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Delivery Instructions:</p>
                    <p className="text-sm text-muted-foreground">{order.deliveryInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span className="capitalize">{order.paymentInfo.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        order.paymentInfo.status === "completed"
                          ? "text-green-600 border-green-200"
                          : "text-yellow-600 border-yellow-200"
                      }
                    >
                      {order.paymentInfo.status}
                    </Badge>
                  </div>
                  {order.paymentInfo.transactionId && (
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span className="font-mono text-xs">{order.paymentInfo.transactionId}</span>
                    </div>
                  )}
                  {order.paymentInfo.paidAt && (
                    <div className="flex justify-between">
                      <span>Paid At:</span>
                      <span>{formatDate(order.paymentInfo.paidAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
