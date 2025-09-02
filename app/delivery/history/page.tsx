"use client"

import { useEffect, useState } from "react"
import { RoleGuard } from "@/components/auth/role-guard"
import Link from "next/link"
import { OrderService } from "@/services/payment-service"
import type { Order } from "@/types/order"

export default function DeliveryHistoryPage() {
  const [orders, setOrders] = useState<Order[] | null>(null)

  useEffect(() => {
    async function load() {
      const all = await OrderService.getOrders()
      setOrders(all)
    }
    load()
  }, [])

  const completed = orders && orders.length > 0 ? orders.filter(o => o.status === "delivered") : []

  const fallback = [
    { id: "HIST-1", customer: "Alice", deliveredAt: "2025-08-30", total: 950 },
  ]

  return (
    <RoleGuard allowedRoles={["DELIVERY"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Delivery History</h1>
        <p className="mt-2 text-gray-600">Past deliveries and completed orders.</p>

        <div className="mt-6">
          {orders === null ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : completed.length === 0 ? (
            <div>
              <p className="mb-4">No completed deliveries recorded — showing a test entry:</p>
              <ul className="space-y-3">
                {fallback.map((r) => (
                  <li key={r.id} className="p-3 border rounded">
                    <div className="font-medium">Order {r.id}</div>
                    <div className="text-sm text-muted-foreground">{r.customer} — Delivered {r.deliveredAt} — KSh {r.total}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {completed.map((o) => (
                <div key={o.id} className="p-3 border rounded">
                  <div className="font-medium">Order {o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.shippingInfo.address} — {o.updatedAt}</div>
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
