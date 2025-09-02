"use client"

import { useEffect, useState } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import Link from "next/link"
import { OrderService } from "@/services/payment-service"
import type { Order } from "@/types/order"

export default function DeliveryOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    async function load() {
      const all = await OrderService.getOrders()
      setOrders(all)
    }
    load()
  }, [])

  const pickup = orders && orders.length > 0 ? orders.filter(o => o.status === "confirmed" || o.status === "processing") : []

  const fallback = [
    { id: "TEST-1", customer: "Jane Doe", address: "Westlands", total: 1200 },
    { id: "TEST-2", customer: "John Smith", address: "Karen", total: 800 },
  ]

  return (
    <RoleGuard allowedRoles={["DELIVERY"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Pickup Orders</h1>
        <p className="mt-2 text-gray-600">Orders ready for pickup.</p>

        <div className="mt-6">
          {orders === null ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : pickup.length === 0 ? (
            <div>
              <p className="mb-4">No pickup orders right now — showing test entries:</p>
              <ul className="space-y-3">
                {fallback.map((r) => (
                  <li key={r.id} className="p-3 border rounded">
                    <div className="font-medium">Order {r.id}</div>
                    <div className="text-sm text-muted-foreground">{r.customer} — {r.address} — KSh {r.total}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {pickup.map((o) => (
                <div key={o.id} className="p-3 border rounded">
                  <div className="font-medium">Order {o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.shippingInfo.address} — {o.paymentInfo.amount} KSh</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Link href="/delivery" className="text-emerald-600 underline">Back to Delivery Dashboard</Link>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
