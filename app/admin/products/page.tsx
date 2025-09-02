"use client"

import { useAuth } from "@/contexts/auth-context"
// Navbar removed: global Header is provided by app layout
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ProductManagement } from "@/components/admin/product-management"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Navbar removed: global Header is provided by app layout */}

      <div className="flex">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-6">
          <ProductManagement />
        </main>
      </div>
    </div>
  )
}
