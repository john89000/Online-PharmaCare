"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Navbar } from "@/components/layout/navbar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Package, AlertTriangle, TrendingUp, ShoppingCart, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for charts
const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 140 },
  { month: "Mar", sales: 48000, orders: 130 },
  { month: "Apr", sales: 61000, orders: 165 },
  { month: "May", sales: 55000, orders: 150 },
  { month: "Jun", sales: 67000, orders: 180 },
]

const categoryData = [
  { name: "Pain Relief", value: 35, color: "#10b981" },
  { name: "Antibiotics", value: 25, color: "#3b82f6" },
  { name: "Vitamins", value: 20, color: "#8b5cf6" },
  { name: "Cold & Flu", value: 12, color: "#f59e0b" },
  { name: "Others", value: 8, color: "#ef4444" },
]

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", items: 3, total: 1250, status: "pending", time: "2 min ago" },
  { id: "ORD-002", customer: "Jane Smith", items: 1, total: 450, status: "processing", time: "5 min ago" },
  { id: "ORD-003", customer: "Mike Johnson", items: 2, total: 800, status: "shipped", time: "12 min ago" },
  { id: "ORD-004", customer: "Sarah Wilson", items: 4, total: 1680, status: "delivered", time: "25 min ago" },
  { id: "ORD-005", customer: "David Brown", items: 1, total: 350, status: "pending", time: "1 hour ago" },
]

const lowStockItems = [
  { name: "Paracetamol 500mg", stock: 8, minStock: 20, category: "Pain Relief" },
  { name: "Vitamin D3 1000IU", stock: 5, minStock: 15, category: "Vitamins" },
  { name: "Cough Syrup 100ml", stock: 3, minStock: 10, category: "Cold & Flu" },
  { name: "Hydrocortisone Cream", stock: 2, minStock: 8, category: "Skin Care" },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    router.push("/")
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, {user.name}! Here's what's happening with your pharmacy.</p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <StatsCards />
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Sales Overview
                </CardTitle>
                <CardDescription>Monthly sales and order trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales" ? formatPrice(Number(value)) : value,
                        name === "sales" ? "Sales" : "Orders",
                      ]}
                    />
                    <Bar dataKey="sales" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Sales by Category
                </CardTitle>
                <CardDescription>Product category distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tables Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.id}</div>
                            <div className="text-sm text-muted-foreground">{order.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.items} items</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                    Low Stock Alerts
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Stock
                  </Button>
                </div>
                <CardDescription>Items that need restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            {item.stock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Restock
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
