"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
  Truck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/admin",
  },
  {
    id: "products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
    href: "/admin/products",
  },
  {
    id: "users",
    label: "Users",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
  },
  {
    id: "orders",
    label: "Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
    href: "/admin/orders",
    badge: "3",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/admin/analytics",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/reports",
  },
  {
    id: "deliveries",
    label: "Deliveries",
    icon: <Truck className="h-5 w-5" />,
    href: "/admin/deliveries",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/settings",
  },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function AdminSidebar({ collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()

  if (user?.role !== "admin") {
    return null
  }

  return (
    <Card className={`h-full transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Manage your pharmacy</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="ml-auto">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${collapsed ? "px-2" : "px-3"} ${
                    isActive ? "bg-emerald-600 hover:bg-emerald-700" : ""
                  }`}
                >
                  {item.icon}
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        {!collapsed && (
          <div className="mt-8 p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-800">Quick Stats</span>
            </div>
            <div className="space-y-2 text-sm text-emerald-700">
              <div className="flex justify-between">
                <span>Low Stock Items:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Orders:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Active Users:</span>
                <span className="font-medium">248</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
