"use client"

import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { PrescriptionManagement } from "@/components/admin/prescription-management"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPrescriptionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!user || user.role !== "admin") {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Management</h1>
            <p className="text-gray-600">Review and validate customer prescription uploads</p>
          </div>

          <PrescriptionManagement />
        </main>
      </div>
    </div>
  )
}
