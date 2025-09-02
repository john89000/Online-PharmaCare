import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface StatCard {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease" | "neutral"
  icon: React.ReactNode
  description?: string
}

const statsData: StatCard[] = [
  {
    title: "Total Revenue",
    value: "KES 2,847,500",
    change: "+12.5%",
    changeType: "increase",
    icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
    description: "vs last month",
  },
  {
    title: "Total Orders",
    value: "1,247",
    change: "+8.2%",
    changeType: "increase",
    icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
    description: "vs last month",
  },
  {
    title: "Active Users",
    value: "2,847",
    change: "+15.3%",
    changeType: "increase",
    icon: <Users className="h-6 w-6 text-purple-600" />,
    description: "vs last month",
  },
  {
    title: "Products in Stock",
    value: "456",
    change: "-2.1%",
    changeType: "decrease",
    icon: <Package className="h-6 w-6 text-orange-600" />,
    description: "vs last month",
  },
  {
    title: "Low Stock Alerts",
    value: "12",
    change: "+3",
    changeType: "increase",
    icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
    description: "items need restocking",
  },
  {
    title: "Completed Deliveries",
    value: "1,156",
    change: "+9.8%",
    changeType: "increase",
    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
    description: "vs last month",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={stat.changeType === "increase" ? "default" : "destructive"}
                className={`text-xs ${
                  stat.changeType === "increase"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : stat.changeType === "decrease"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {stat.changeType === "increase" && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.changeType === "decrease" && <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}
              </Badge>
              {stat.description && <span className="text-xs text-muted-foreground">{stat.description}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
