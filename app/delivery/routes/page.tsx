"use client"

import { useEffect, useState } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import Link from "next/link"
import { OrderService } from "@/services/payment-service"
import type { Order } from "@/types/order"

export default function DeliveryRoutesPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    async function load() {
      const all = await OrderService.getOrders()
      setOrders(all)
    }
    load()
  }, [])

  const activeRoutes = orders && orders.length > 0 ? orders.filter(o => o.status !== "delivered" && o.status !== "cancelled") : []

  // Fallback test route entries when no active routes
  const fallback = [
    { id: "RT-1", label: "Route A - Westlands", count: 3 },
    { id: "RT-2", label: "Route B - Karen", count: 2 },
  ]

  return (
    <RoleGuard allowedRoles={["DELIVERY"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Delivery Routes</h1>
        <p className="mt-2 text-gray-600">Overview of active routes and assignments.</p>

        <div className="mt-6">
          {orders === null ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : activeRoutes.length === 0 ? (
            <div>
              <p className="mb-4">No active delivery routes at the moment. Showing test routes for demo:</p>
              <ul className="space-y-3">
                {fallback.map((r) => (
                  <li key={r.id} className="p-3 border rounded">{r.label} — {r.count} stops</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {activeRoutes.map((o) => (
                <div key={o.id} className="p-3 border rounded">
                  <div className="font-medium">Order {o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.shippingInfo.address} — {o.status}</div>
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
